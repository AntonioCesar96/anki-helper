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

  allPronuncias: any[] = [];
  allPronunciasPorFinal: Map<any, any[]>;

  constructor(
    private fb: FormBuilder,
    private adicionarService: AdicionarPronunciaService) { }

  ngOnInit(): void {
    let allPronuncias = JSON.parse(localStorage.getItem('pronuncias') || '[]');

    this.allPronuncias = allPronuncias;
    this.criarMapComMensagensOrdenadasPorData();


    this.mostrarLoader = true;
    this.adicionarService.obterDecks()
      .subscribe(res => {
        this.mostrarLoader = false;
        if (res && res.length > 0) {
          this.decks = res;
          this.changeDeck("02 - italk - pt -> en - bkp");
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
    // this.buscarPronuncia(textoSelecionado);

    var cursorPos = $('#textarea').prop('selectionStart');
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos + textoSelecionado?.length, v.length);

    $('#textarea').val(textBefore + '<b>' + textoSelecionado + '</b>' + textAfter);
  }

  inserirBR() {
    var cursorPos = $('#textarea').prop('selectionStart');
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);

    $('#textarea').val(textBefore + '<br>' + textAfter);
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

      let backkkk = '';
      if (linha.includes("\\")) {
        let split5 = linha.split("\\");

        linha = split5[0];
        backkkk = split5[1];
      }

      card.fields.Front = `${linha}`;
      card.fields.Back = `${backkkk}<br>`;

      await this.buscarPronunciaAsync(linha);

      for (let g = 0; g < this.pronunciasGoogle.length; g++) {
        const pronuncia = this.pronunciasGoogle[g];

        if (!card.fields.Back.includes(pronuncia.palavra)) {
          continue;
        }

        if (pronuncia.pronuncia != '') {

          // card.fields.Back += `<br>${pronuncia.pronuncia} [sound:${pronuncia.nome}]`;

          card.fields.Back += `<br> ${pronuncia.palavra} (${pronuncia.pronuncia}) [sound:${pronuncia.nome}]`;

          continue;
        }

        card.fields.Back = card.fields.Back.replace(pronuncia.palavra,
          pronuncia.palavra + '[sound:' + pronuncia.nome + ']');
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

    if (event.ctrlKey && event.code === 'KeyI') {
      var textoSelecionado = window.getSelection()?.toString();
      this.buscarPronuncia(textoSelecionado);
    }

    if (event.ctrlKey && event.code === 'KeyM') {
      this.inserirBR()
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

  //////////////////////////////////////////
  criarMapComMensagensOrdenadasPorData() {
    this.allPronuncias.forEach(x => {
      x.palavra = x.palavra.replace('“', '').replace('”', '')
        .replace('.', '').replace(',', '').replace('—', '').replace(':', '').replace(';', '')
        .replace('!', '').replace('?', '').replace('"', '').replace(')', '').replace('(', '')
        .replace('-', '').replace('."', '').replace('.', '')
        .toLocaleLowerCase();


      let splits = x.pronuncia.split('·');
      for (let i = 0; i < splits.length; i++) {
        const element = splits[i];

        if (element === element.toUpperCase()) {
          x.pronuncia = x.pronuncia.replace(element, `<b>${element.toLowerCase()}</b>`)
        }
      }

      x.pronuncia = `(${x.pronuncia})`;
    });

    let listaNegra = ['', "80/20", "109", "1920s", "7581280", "40", "$2416", "$1650", "74", "0934"];

    this.allPronuncias = this.allPronuncias.filter(x => !listaNegra.some(y => y === x.palavra));

    this.allPronunciasPorFinal = new Map<string, any[]>();
    const finaisPalavras = this.obterFinaisDasPalavras();

    finaisPalavras.forEach(finalPalavra => {
      const mensagens = this.obterPalavrasPorFinaisDasPalavras(finalPalavra);
      // const key = this.criarKeyParaMapMensagensPorData(finalPalavra);

      this.allPronunciasPorFinal.set(finalPalavra, mensagens);
    });
  }

  obterFinaisDasPalavras() {
    let aux = this.allPronuncias.map(x =>
      x.palavra.substring(x.palavra.length - 3, x.palavra.length)
    );
    aux = aux.filter((item, i, ar) => ar.indexOf(item) === i);
    aux = aux.sort((d1, d2) => d1.localeCompare(d2));

    return aux;
  }

  obterPalavrasPorFinaisDasPalavras(finalPalavra: string) {
    return this.allPronuncias.filter(x => x.palavra.substring(x.palavra.length - 3, x.palavra.length) === finalPalavra)
      .sort((d1, d2) => d1.palavra.localeCompare(d2.palavra));
  }

  // criarKeyParaMapMensagensPorData(finalPalavra: string) {
  //   const diferencaEmDias = moment().diff(moment(data), 'days');
  //   let dataDescricao = moment(data).format('L');

  //   if (diferencaEmDias < 2) {
  //     dataDescricao = moment(data).calendar(null, {
  //       lastDay: '[ontem]',
  //       sameDay: '[hoje]',
  //     })
  //   } else if (diferencaEmDias < 7) {
  //     dataDescricao = moment(data).format('dddd');
  //   }

  //   return { dataDescricao, data: moment(data).format('L') };
  // }


  pronunciar(item: any) {
    let audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${item.palavra}`);
    audio.play();
  }
}
