import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Imagem, Pronuncia, RootObject, Significado, Traducao, Cartao, Anexo, Exemplo } from 'src/app/_common/models/models';
import { AdicionarGramaticaService } from '../adicionar.service';
declare var $: any;

@Component({
  selector: 'app-adicionar-gramatica',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdicionarGramaticaComponent implements OnInit {
  @ViewChild('audioEl') audioEl!: ElementRef<HTMLAudioElement>;

  @ViewChild('ankiUnidade') ankiUnidade!: ElementRef;
  @ViewChild('ankiQuestao') ankiQuestao!: ElementRef;

  meuInput: string = "";

  rootObject!: RootObject;
  traducoesSelecionadas: Traducao[] = [];
  pronunciasSelecionadas: Pronuncia[] = [];
  significadosSelecionados: Significado[] = [];
  imagensSelecionadas: Imagem[] = [];
  decks: string[] = [];
  deckSelecionado: string = '';
  audiosSelecionados: Anexo[] = [];
  traducaoFrase = '';
  mostrarTraducao = false;
  mostrarContext = false;
  mostrarLoader = false;

  idSessao = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');

  constructor(
    private fb: FormBuilder,
    private adicionarService: AdicionarGramaticaService) { }

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


    setInterval(() => {
      sessionStorage.setItem(this.idSessao, this.meuInput);
    }, 1000)
  }


  playTTS(text: any) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${text}`;
    const elemento = this.audioEl.nativeElement;
    elemento.src = url;
  };

  obterAudio() {
    this.mostrarLoader = true;
    var textoSelecionado = window.getSelection()?.toString();
    var anexo = new Anexo();
    anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');
    anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${textoSelecionado}`;

    this.audiosSelecionados.push(anexo);

    var audio = new Audio(anexo.url);
    audio.play();

    this.insertHtmlAfterSelection(textoSelecionado, '<a id="' + anexo.nome + '" class="btn btn-primary"><span class="audio"></span></a>')
    setTimeout(() => {
      const elementoAnki = this.ankiUnidade.nativeElement;
      var el = elementoAnki.querySelector('#' + anexo.nome);
      if (!el) {
        const elementoAnki = this.ankiUnidade.nativeElement;
        el = elementoAnki.querySelector('#' + anexo.nome);
      }

      if (el) {
        el.addEventListener('click', () => { this.tocar(anexo.nome) });
      }
    }, 500);

    this.mostrarLoader = false;
  }

  tocar(nome: any) {
    var audioEncontrado = this.audiosSelecionados.find(x => x.nome === nome);
    if (audioEncontrado) {
      var audio = new Audio(audioEncontrado.url);
      audio.play();
    }
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

  inserirUnderline() {
    var textoSelecionado = window.getSelection()?.toString();

    var cursorPos = $('#textarea').prop('selectionStart');
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos + textoSelecionado?.length, v.length);

    $('#textarea').val(textBefore + '___' + textAfter);
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

  adicionar() {
    this.mostrarLoader = true;

    var linhas = $('#textarea').val().split('\n');


    var cards = [];
    var descricaoUnidade = this.ankiUnidade.nativeElement.innerHTML;
    var descricaoQuestao = this.ankiQuestao.nativeElement.innerHTML;
    var card: any = {};
    var ultimoEhFront = false;
    var ultimoEhBack = false;

    for (let i = 0; i < linhas.length; i++) {
      var linha = linhas[i].trim();

      if (linha.length > 0 && linha[0].trim() == 'f') {
        if (ultimoEhFront) {
          card.fields.Front += '<br>' + linha.split('*')[1].trim();
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
        card.fields.Front = `${descricaoUnidade}<br><br>`;
        card.fields.Front += `${descricaoQuestao}<br><br>`;
        card.fields.Front += linha.split('*')[1].trim();
        ultimoEhFront = true;
        ultimoEhBack = false;
        cards.push(card);
        continue;
      }

      if (linha.length > 0) {
        if (ultimoEhBack) {
          card.fields.Back += '<br>' + linha.trim();
          continue;
        }

        card.fields.Back += linha.trim();
        ultimoEhFront = false;
        ultimoEhBack = true;
        continue;
      }
    }


    var anexos = [];
    for (let i = 0; i < this.audiosSelecionados.length; i++) {
      const audio = this.audiosSelecionados[i];

      var anexo = new Anexo();
      anexo.nome = audio.nome + '.mp3';
      anexo.url = audio.url;

      var replace = '<a id="' + audio.nome + '" class="btn btn-primary"><span class="audio"></span></a>';

      for (let j = 0; j < cards.length; j++) {
        cards[j].fields.Front = cards[j].fields.Front.replace(replace, '[sound:' + anexo.nome + ']');
        cards[j].fields.Back = cards[j].fields.Back.replace(replace, '[sound:' + anexo.nome + ']');
      }

      anexos.push(anexo);
    }

    var anki = {
      cards: cards,
      anexos: anexos
    }

    console.log(anki);


    this.adicionarService.salvarNotas(anki).subscribe(res => {
      this.mostrarLoader = false;
      if (!res.error) {
        this.limpar();
      }
    });

  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log('event.ctrlKey: ' + event.ctrlKey);
    console.log('event.key: ' + event.key);
  }
}











































