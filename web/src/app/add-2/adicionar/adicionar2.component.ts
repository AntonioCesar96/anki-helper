import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Imagem, Pronuncia, RootObject, Significado, Traducao, Cartao, Anexo, Exemplo } from 'src/app/_common/models/models';
import { Adicionar2Service } from '../adicionar2.service';
declare var $: any;

@Component({
  selector: 'app-adicionar-2',
  templateUrl: './adicionar2.component.html',
  styleUrls: ['./adicionar2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Adicionar2Component implements OnInit {
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

  listaI: string[] = [];

  idSessao = 'aaaa';//'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');

  constructor(
    private fb: FormBuilder,
    private adicionarService: Adicionar2Service) { }

  ngOnInit(): void {
    this.mostrarLoader = true;
    this.adicionarService.obterDecks()
      .subscribe(res => {
        this.mostrarLoader = false;
        if (res && res.length > 0) {
          this.decks = res;

          var deckStorage = localStorage.getItem('deck');
          if (deckStorage) {
            this.changeDeck(deckStorage);
            return;
          }
          this.changeDeck(res[0]);
        }
      });

    this.meuInput = sessionStorage.getItem('aaaa');

    setInterval(() => {
      sessionStorage.setItem(this.idSessao, this.meuInput);
    }, 1000)
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
    if (textoSelecionado) {
      this.listaI.push(textoSelecionado);
    }

    var cursorPos = $('#textarea').prop('selectionStart');
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos + textoSelecionado?.length, v.length);

    $('#textarea').val(textBefore + '<b>' + textoSelecionado + '</b>' + textAfter);
  }

  changeDeck(value: any) {
    this.deckSelecionado = value;
    localStorage.setItem('deck', value);
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

    let anexos: Anexo[] = [];
    let pronuncias = await this.adicionarService.obterPronuncias(this.listaI);

    for (let g = 0; g < pronuncias.length; g++) {
      const pronuncia = pronuncias[g];

      let anexo = new Anexo();
      anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '') + '.mp3';
      anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${pronuncia.palavra}`;

      anexos.push(anexo);

      pronuncia.nome = anexo.nome;
    }

    //
    let linhas = $('#textarea').val().split('\n');
    let cards = [];
    let card: any = {};

    for (let i = 0; i < linhas.length; i++) {
      let linha = linhas[i].trim();

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

      let traducao1 = await this.adicionarService.obterTraducao(linha);

      var linhaSemNegrito = linha.replace('<b>', '').replace('</b>', '');
      let traducao2 = await this.adicionarService.obterTraducao(linhaSemNegrito);

      let split1 = linha.split('<b>');
      let split2 = split1[1].split('</b>');
      let palavraEmIngles = split2[0].trim();

      let palavraEmPortugues = "";
      if (traducao1.includes("<b>")) {
        split1 = traducao1.split('<b>');
        split2 = split1[1].split('</b>');
        palavraEmPortugues = split2[0].trim();
      }

      // 
      card.fields.Front = `${linha}<br>`;

      for (let g = 0; g < pronuncias.length; g++) {
        const pronuncia = pronuncias[g];

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
      let dicionarios = [];
      let imagens = [];

      const promises = [
        this.adicionarService.obterContext(palavraEmIngles, palavraEmPortugues),
        // this.adicionarService.obterImagem(palavraEmIngles, palavraEmPortugues),
        this.adicionarService.obterDefinicao(palavraEmIngles),
      ];

      var promisesResult = await Promise.all(promises);
      for (let w = 0; w < promisesResult.length; w++) {
        const element = promisesResult[w];

        if (element.dicionarios) {
          dicionarios = element.dicionarios;
        }
        if (element.sinonimos) {
          sinonimos = element.sinonimos;
        }
        if (element.imagens) {
          imagens = element.imagens;
        }
      }

      card.fields.Back = `${traducao1}<br>`;
      card.fields.Back += `${traducao2}<br><br>`;

      if (sinonimos) {
        for (let l = 0; l < sinonimos.length; l++) {
          const element = sinonimos[l];

          card.fields.Back += `${element.sinonimos}<br>`;
          card.fields.Back += `<b>${element.palavraIngles}:</b> ${element.palavraPortugues}<br><br>`;
        }
      }

      if (dicionarios && dicionarios.length > 0 && dicionarios[0].significados
        && dicionarios[0].significados.length > 0) {
        for (let l = 0; l < dicionarios[0].significados.length; l++) {
          const element = dicionarios[0].significados[l];

          card.fields.Back += `<br><i>${element.definicao}:</i><br>`;
          console.log(`<i>${element.definicao}:</i><br>`);

          if (element.exemplos && element.exemplos.length > 0) {
            for (let t = 0; t < (element.exemplos.length > 2 ? 2 : element.exemplos.length); t++) {
              const element2 = element.exemplos[t];
              card.fields.Back += `- ${element2.exemplo}:<br>`;
              console.log(`- ${element2.exemplo}:<br>`);
            }
          }
        }
      }

      if (imagens) {
        card.fields.Back += `<br><br>`;
        for (let u = 0; u < imagens.length; u++) {

          let anexo = new Anexo();
          anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '') + '.jpg';
          anexo.url = imagens[u];

          anexos.push(anexo);

          card.fields.Back += `<img src="${anexo.nome}" />`;
        }
      }

      cards.push(card);
    }

    let anki = {
      cards: cards,
      anexos: anexos,
    }

    console.log(cards);


    this.adicionarService.salvarNotas(anki).subscribe(res => {
      this.mostrarLoader = false;
      if (!res.error) {
        this.mostrarLoader = false;
        this.limpar();
      }
    });


  }

  getListaI() {
    return this.listaI;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'KeyB') {
      this.inserirNegrito();
    }

    if (event.ctrlKey && event.code === 'KeyI') {
      var textoSelecionado = window.getSelection()?.toString();

      if (textoSelecionado) {
        this.listaI.push(textoSelecionado.trim());
      }
    }
  }
}
