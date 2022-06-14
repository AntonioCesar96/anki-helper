import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { find, slice } from 'cheerio/lib/api/traversing';
import { firstValueFrom } from 'rxjs';
import { Imagem, Pronuncia, RootObject, Significado, Traducao, Cartao, Anexo, Exemplo } from 'src/app/_common/models/models';
import { AdicionarPortuguesService } from '../add-portugues.service';
declare var $: any;

@Component({
  selector: 'app-adicionar-portugues',
  templateUrl: './add-portugues.component.html',
  styleUrls: ['./add-portugues.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdicionarPortuguesComponent implements OnInit {
  @ViewChild('audioEl') audioEl!: ElementRef<HTMLAudioElement>;

  @ViewChild('ankiUnidade') ankiUnidade!: ElementRef;

  meuInput: string | any = "";

  rootObject!: RootObject;
  traducoesSelecionadas: Traducao[] = [];
  pronunciasSelecionadas: Pronuncia[] = [];
  significadosSelecionados: Significado[] = [];
  imagensSelecionadas: Imagem[] = [];
  decks: string[] = [];
  deckSelecionado: string = '';
  traducaoFrase = '';
  mostrarTraducao = false;
  mostrarContext = false;
  mostrarLoader = false;
  buscarImagens = true;

  anexos: Anexo[] = [];
  pronunciasGoogle: any[] = [];

  idSessao = 'aaaa';//'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');

  constructor(
    private fb: FormBuilder,
    private adicionarService: AdicionarPortuguesService) { }

  ngOnInit(): void {
    this.mostrarLoader = true;
    this.adicionarService.obterDecks()
      .subscribe(res => {
        this.mostrarLoader = false;
        if (res && res.length > 0) {
          this.decks = res;
          this.changeDeck("00 - Português");
        }
      });

    this.meuInput = sessionStorage.getItem('aaaa');

    setInterval(() => {
      sessionStorage.setItem(this.idSessao, this.meuInput);
    }, 1000);
  }


  playTTS(text: any) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${text}`;
    const elemento = this.audioEl.nativeElement;
    elemento.src = url;
  };

  insertHtmlAfterSelection(textoSelecionado: any, html: any) {

    var cursorPos = $('#textarea').prop('selectionStart') + textoSelecionado.length;
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);

    $('#textarea').val(textBefore + html + textAfter);
  }

  inserirNegrito() {
    var textoSelecionado = window.getSelection()?.toString();

    var cursorPos = $('#textarea').prop('selectionStart');
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos + textoSelecionado?.length, v.length);

    $('#textarea').val(textBefore + '<b>' + textoSelecionado + '</b>' + textAfter);
  }

  changeDeck(value: any) {
    this.deckSelecionado = value;
  }

  limpar() {
    // window.location.reload();
  }

  onPaste(e: ClipboardEvent) {
    if (!e.clipboardData) {
      return
    }
    e.preventDefault();

    var text = e.clipboardData.getData('text/plain');
    document.execCommand("insertHTML", false, text);
  }

  async adicionar() {
    this.mostrarLoader = true;

    //
    let linhas = $('#textarea').val().split('\n');
    let card: any = {};

    for (let i = 0; i < linhas.length; i++) {
      let linha = linhas[i].trim();
      let ultimaLinha = i == (linhas.length - 1)
      let linhasRestantes = linhas.slice((i + 1)).join('\n');

      if (linha === '') {
        continue;
      }

      card = {
        deckName: this.deckSelecionado,
        modelName: "Basic",
        fields: {
          Front: '',
          Back: '',
        },
        options: {
          allowDuplicate: false,
          duplicateScope: "deck",
          duplicateScopeOptions: {
            deckName: this.deckSelecionado,
            checkChildren: false,
            checkAllModels: false
          }
        },
        tags: []
      };

      let print;
      if (linha.includes("[")) {
        var split3 = linha.split('[');
        var split4 = split3[1].split(']');
        var imagem = split4[0].trim();

        print = new Anexo();
        print.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '') + '.jpg';
        print.url = `http://localhost:3000/${imagem}.jpg`;

        this.anexos.push(print);

        linha = split3[0];
      }

      let split1 = linha.split('<b>');
      let split2 = split1[1].split('</b>');
      let palavraEmIngles = split2[0].trim();

      // 
      card.fields.Front = `${linha}<br>`;

      let palavrasDaFrase = linha.replace('<b>', '').replace('</b>', '').replace(/[^\w\s]/gi, ' ').split(' ');
      let pronunciasOrdenadas: any[] = [];
      for (let g = 0; g < palavrasDaFrase.length; g++) {
        const pronuncia = this.pronunciasGoogle.find(x => x.palavra == palavrasDaFrase[g]);
        if (pronuncia) {
          const pronuncia2 = pronunciasOrdenadas.find(x => x.palavra == pronuncia.palavra);
          if (!pronuncia2) {
            pronunciasOrdenadas.push(pronuncia);
          }
        }
      }

      for (let g = 0; g < this.pronunciasGoogle.length; g++) {
        const pronuncia = pronunciasOrdenadas.find(x => x.palavra == this.pronunciasGoogle[g].palavra);
        if (!pronuncia) {
          pronunciasOrdenadas.push(this.pronunciasGoogle[g]);
        }
      }

      for (let g = 0; g < pronunciasOrdenadas.length; g++) {
        const pronuncia = pronunciasOrdenadas[g];

        if (!card.fields.Front.includes(pronuncia.palavra)) {
          continue;
        }

        if (pronuncia.pronuncia != '') {
          card.fields.Front += `<br>${pronuncia.pronuncia} [sound:${pronuncia.nome}]`;
          continue;
        }

        card.fields.Front = card.fields.Front.replace(pronuncia.palavra,
          pronuncia.palavra + '[sound:' + pronuncia.nome + ']');
      }

      let sinonimos = [];
      let definicoes = [];
      let imagens = [];

      const promises = [
        this.adicionarService.obterDefinicaoGoogleMeaning(palavraEmIngles),
        this.adicionarService.obterDefinicaoDicio(palavraEmIngles),
      ];

      var promisesResult = await Promise.all(promises);
      for (let w = 0; w < promisesResult.length; w++) {
        const element = promisesResult[w];

        if (element.dicionario) {
          definicoes.push(element);
        }
        if (element.sinonimos) {
          sinonimos = element.sinonimos;
        }
        if (element.imagens) {
          imagens = element.imagens;
        }
      }

      card.fields.Back = ``;

      if (sinonimos) {
        for (let l = 0; l < sinonimos.length; l++) {
          const element = sinonimos[l];

          card.fields.Back += `${element.sinonimos}<br>`;
          card.fields.Back += `<b>${element.palavraIngles}:</b> ${element.palavraPortugues}<br><br>`;
        }
      }

      definicoes = definicoes.sort(function (a, b) { return a.ordem - b.ordem });
      if (definicoes && definicoes.length > 0) {
        for (let w = 0; w < definicoes.length; w++) {
          card.fields.Back += `<br>${definicoes[w].origem}`;

          for (let l = 0; l < definicoes[w].dicionario.length; l++) {
            const element = definicoes[w].dicionario[l];

            card.fields.Back += `<br>${element.definicao}<br>`;

            if (element.exemplos && element.exemplos.length > 0) {
              for (let t = 0; t < (element.exemplos.length > 2 ? 2 : element.exemplos.length); t++) {
                const element2 = element.exemplos[t];
                card.fields.Back += `- ${element2.exemplo}:<br>`;
              }
            }
          }
        }
      }

      if (print) {
        card.fields.Back += `<img src="${print.nome}" />`;
      }

      let anki = {
        cards: [card],
        anexos: this.anexos,
      }

      var res = await this.adicionarService.salvarNotas(anki);
      this.anexos = [];
      $('#textarea').val(linhasRestantes);
    }

    this.pronunciasGoogle = [];
    this.mostrarLoader = false;
  }

  @HostListener('window:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'KeyB') {
      this.inserirNegrito();
    }
  }

  copyToClipboard(text: any) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
  }
}
