import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { find, slice } from 'cheerio/lib/api/traversing';
import { firstValueFrom } from 'rxjs';
import { Imagem, Pronuncia, RootObject, Significado, Traducao, Cartao, Anexo, Exemplo } from 'src/app/_common/models/models';
import { AdicionarPronunciaService } from '../adicionar-pronuncia.service';
declare var $: any;

@Component({
  selector: 'app-adicionar-pronuncia',
  templateUrl: './adicionar-pronuncia.component.html',
  styleUrls: ['./adicionar-pronuncia.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdicionarPronunciaComponent implements OnInit {
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

  anexos: Anexo[] = [];
  pronunciasGoogle: any[] = [];

  idSessao = 'aaaa';//'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');

  constructor(
    private fb: FormBuilder,
    private adicionarService: AdicionarPronunciaService) { }

  ngOnInit(): void {
    this.mostrarLoader = true;
    this.adicionarService.obterDecks()
      .subscribe(res => {
        this.mostrarLoader = false;
        if (res && res.length > 0) {
          this.decks = res;
          this.changeDeck("99 - Pronunciation");
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
    this.buscarPronuncia(textoSelecionado);

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

      card.fields.Front = `${linha}<br>`;

      await this.buscarPronunciaAsync(linha);

      for (let g = 0; g < this.pronunciasGoogle.length; g++) {
        const pronuncia = this.pronunciasGoogle[g];
 
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

      let anki = {
        cards: [card],
        anexos: this.anexos,
      }

      var res = await this.adicionarService.salvarNotas(anki);
      this.anexos = [];
      $('#textarea').val(linhasRestantes);

      if (ultimaLinha) {
        this.mostrarLoader = false;
      }
    }
  }

  @HostListener('window:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'KeyB') {
      this.inserirNegrito();
    }

    if (event.ctrlKey && event.code === 'KeyI') {
      var textoSelecionado = window.getSelection()?.toString();
      this.buscarPronuncia(textoSelecionado);
    }
  }

  buscarPronuncia(textoSelecionado: any) {
    if (textoSelecionado) {
      textoSelecionado = textoSelecionado.trim();

      var existe = this.pronunciasGoogle.some(x => x.palavra === textoSelecionado)
      if (existe) {
        return;
      }

      this.adicionarService.obterPronunciasObservable([textoSelecionado]).subscribe(pronuncias => {
        for (let g = 0; g < pronuncias.length; g++) {
          const pronuncia = pronuncias[g];

          let anexo = new Anexo();
          anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '') + '.mp3';
          anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${pronuncia.palavra}`;

          pronuncia.nome = anexo.nome;

          this.anexos.push(anexo);
          this.pronunciasGoogle.push(pronuncia);
        }
      });
    }
  }

  tocar(palavra: any) {
    var audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${palavra}`);
    audio.play();
  };

  async buscarPronunciaAsync(textoSelecionado: any) {
    if (textoSelecionado) {
      textoSelecionado = textoSelecionado.trim();

      var existe = this.pronunciasGoogle.some(x => x.palavra === textoSelecionado)
      if (existe) {
        return;
      }

      var pronuncias = await this.adicionarService.obterPronuncias([textoSelecionado]);

      for (let g = 0; g < pronuncias.length; g++) {
        const pronuncia = pronuncias[g];

        let anexo = new Anexo();
        anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '') + '.mp3';
        anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${pronuncia.palavra}`;

        pronuncia.nome = anexo.nome;

        this.anexos.push(anexo);
        this.pronunciasGoogle.push(pronuncia);
      }
    }
  }
}
