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

    let audiosSelecionados: Anexo[] = [];
    let pronuncias = await this.adicionarService.obterPronuncias(this.listaI);

    for (let g = 0; g < pronuncias.length; g++) {
      const pronuncia = pronuncias[g];

      let anexo = new Anexo();
      anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '') + '.mp3';
      anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${pronuncia.palavra}`;

      audiosSelecionados.push(anexo);

      pronuncia.nome = anexo.nome;
    }

    //
    let linhas = $('#textarea').val().split('\n');
    let cards = [];
    let card: any = {};

    for (let i = 0; i < linhas.length; i++) {
      let linha = linhas[i].trim();

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

      let traducao = await this.adicionarService.obterTraducao(linha);

      let split1 = linha.split('<b>');
      let split2 = split1[1].split('</b>');
      let palavraEmIngles = split2[0];

      let palavraEmPortugues = "";
      if (traducao.includes("<b>")) {
        split1 = traducao.split('<b>');
        split2 = split1[1].split('</b>');
        palavraEmPortugues = split2[0];
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

      card.fields.Back = `${traducao}<br><br>`;
      card.fields.Back += `<b>${palavraEmIngles}:</b> ${palavraEmPortugues}`;

      cards.push(card);
    }

    let anki = {
      cards: cards,
      anexos: audiosSelecionados
    }

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