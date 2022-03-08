import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

  @ViewChild('anki') anki!: ElementRef;

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
      const elementoAnkiFront = this.anki.nativeElement;
      sessionStorage.setItem(this.idSessao, elementoAnkiFront.innerHTML);
    }, 1000)
  }


  playTTS(text: any) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${text}`;
    const elemento = this.audioEl.nativeElement;
    elemento.src = url;
  };

  obterAudio() {
    this.mostrarLoader = true;

    var anexo = new Anexo();
    anexo.nome = 'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');
    anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${window.getSelection()}`;

    this.audiosSelecionados.push(anexo);

    var audio = new Audio(anexo.url);
    audio.play();

    this.insertHtmlAfterSelection('<a id="' + anexo.nome + '" class="btn btn-primary"><span class="audio"></span></a>')
    setTimeout(() => {
      const elementoAnki = this.anki.nativeElement;
      var el = elementoAnki.querySelector('#' + anexo.nome);
      if (!el) {
        const elementoAnki = this.anki.nativeElement;
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

  insertHtmlAfterSelection(html: any) {
    var sel, range, expandedSelRange, node;
    if (window && window.getSelection) {
      sel = window.getSelection();
      if (sel && sel.getRangeAt && sel.rangeCount) {
        var rageAUx = window.getSelection();
        if (rageAUx) {
          range = rageAUx.getRangeAt(0);
          expandedSelRange = range.cloneRange();
          range.collapse(false);

          // Range.createContextualFragment() would be useful here but is
          // non-standard and not supported in all browsers (IE9, for one)
          var el = document.createElement("div");
          el.innerHTML = html;
          var frag = document.createDocumentFragment(), node, lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);

          // Preserve the selection
          if (lastNode) {
            expandedSelRange.setEndAfter(lastNode);
            sel.removeAllRanges();
            sel.addRange(expandedSelRange);
          }
        }
      }
    }
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

    console.log(this.meuInput)

    /*
    this.mostrarLoader = true;

    const linhas = $(this.anki.nativeElement).find('> div')

    var cards = [];
    var descricaoUnidade = '';
    var descricaoQuestao = '';
    var card: any = {};
    var ultimoEhFront = false;

    for (let i = 0; i < linhas.length; i++) {
      var linha = $(linhas[i]).html().trim();

      while (linha.includes('&nbsp;')) {
        linha = linha.replace('&nbsp;', '').trim();
      }

      while (linha.trim()[0] == '<') {
        linha = $(linha).html().trim();
      }

      if (linha.length > 0 && linha[0].trim() == 'u') {
        descricaoUnidade = linha.split(':')[1].trim();
        ultimoEhFront = false;
        continue;
      }

      if (linha.length > 0 && linha[0].trim() == 'q') {
        descricaoQuestao = linha.split(':')[1].trim();
        ultimoEhFront = false;
        continue;
      }

      if (linha.length > 0 && linha[0].trim() == 'f') {
        if (ultimoEhFront) {
          card.fields.Front += linha.split(':')[1].trim();
          if (!linha.split(':')[1].trim().includes('<br>')) {
            card.fields.Front += '<br>';
          }
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
        card.fields.Front += linha.split(':')[1].trim();
        if (!linha.split(':')[1].trim().includes('<br>')) {
          card.fields.Front += '<br>';
        }
        ultimoEhFront = true;
        cards.push(card);
        continue;
      }

      if (linha.length > 0 && linha[0].trim() == 'b') {
        card.fields.Back += linha.split(':')[1].trim();
        if (!linha.split(':')[1].trim().includes('<br>')) {
          card.fields.Back += '<br>';
        }
        ultimoEhFront = false;
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
    */
  }
}
