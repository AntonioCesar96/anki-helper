import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { find, slice } from 'cheerio/lib/api/traversing';
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
  buscarImagens = true;

  anexos: Anexo[] = [];
  pronunciasGoogle: any[] = [];

  idSessao = 'aaaa';//'a' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');

  constructor(
    private fb: FormBuilder,
    private adicionarService: Adicionar2Service) { }

  ngOnInit(): void {
    this.mostrarLoader = true;
    var buscarImagem = sessionStorage.getItem('buscarImagem');
    if (buscarImagem) {
      this.changeBuscarImagem(buscarImagem);
    }

    this.adicionarService.obterDecks()
      .subscribe(res => {
        this.mostrarLoader = false;
        if (res && res.length > 0) {

          this.decks = res;
          // this.decks = res.filter(x => 
          //   !x.startsWith('01') && 
          //   !x.startsWith('02') && 
          //   !x.startsWith('99') && 
          //   !x.startsWith('00'));

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
    this.buscarPronuncia(textoSelecionado);

    var cursorPos = $('#textarea').prop('selectionStart');
    var v = $('#textarea').val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos + textoSelecionado?.length, v.length);

    $('#textarea').val(textBefore + '<b>' + textoSelecionado + '</b>' + textAfter);
  }

  changeDeck(value: any) {
    this.deckSelecionado = value;
    localStorage.setItem('deck', value);

    if(value === '03 - Excessos') {
      this.changeBuscarImagem('false');
      return;
    }
    this.changeBuscarImagem('true');
  }

  changeBuscarImagem(value: string) {
    this.buscarImagens = value === 'true' ? true : false;
    sessionStorage.setItem('buscarImagem', value);
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
    this.mudarIcon();

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

      let backkkk = '';
      if (linha.includes("\\")) {
        let split5 = linha.split("\\");

        linha = split5[0];
        backkkk = split5[1];
      }

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

      // let palavrasDaFrase = linha.replace('<b>', '').replace('</b>', '').replace(/[^\w\s]/gi, ' ').split(' ');
      // let pronunciasOrdenadas: any[] = [];
      // for (let g = 0; g < palavrasDaFrase.length; g++) {
      //   const pronuncia = this.pronunciasGoogle.find(x => x.palavra == palavrasDaFrase[g]);
      //   if (pronuncia) {
      //     const pronuncia2 = pronunciasOrdenadas.find(x => x.palavra == pronuncia.palavra);
      //     if (!pronuncia2) {
      //       pronunciasOrdenadas.push(pronuncia);
      //     }
      //   }
      // }

      // for (let g = 0; g < this.pronunciasGoogle.length; g++) {
      //   const pronuncia = pronunciasOrdenadas.find(x => x.palavra == this.pronunciasGoogle[g].palavra);
      //   if (!pronuncia) {
      //     pronunciasOrdenadas.push(this.pronunciasGoogle[g]);
      //   }
      // }

      for (let g = 0; g < this.pronunciasGoogle.length; g++) {
        const pronuncia = this.pronunciasGoogle[g];

        if (!card.fields.Front.includes(pronuncia.palavra)) {
          continue;
        }

        if (pronuncia.pronuncia != '') {
          // card.fields.Front += `<br>${pronuncia.pronuncia} [sound:${pronuncia.nome}]`;
 
          card.fields.Front += `<br> ${pronuncia.palavra} (${pronuncia.pronuncia}) [sound:${pronuncia.nome}]`;

          continue; 
        }

        card.fields.Front = card.fields.Front.replace(pronuncia.palavra,
          pronuncia.palavra + '[sound:' + pronuncia.nome + ']');
      }

      let sinonimos = [];
      let definicoes = [];
      let imagens = [];

      const promises = [
        this.adicionarService.obterContext(palavraEmIngles, palavraEmPortugues),
        this.adicionarService.obterDefinicaoCambridge(palavraEmIngles),
        this.adicionarService.obterDefinicaoCollins(palavraEmIngles),
        this.adicionarService.obterDefinicaoGoogleMeaning(palavraEmIngles),
      ];

      if (this.buscarImagens) {
        promises.push(this.adicionarService.obterImagem(palavraEmIngles, palavraEmPortugues));
      }

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

      card.fields.Back = `${traducao1}<br>`;
      card.fields.Back += `${traducao2}<br><br>`;
      card.fields.Back += `${backkkk}<br><br>`;

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

            card.fields.Back += `<br><i>${element.definicao}</i><br>`;

            if (element.exemplos && element.exemplos.length > 0) {
              for (let t = 0; t < (element.exemplos.length > 2 ? 2 : element.exemplos.length); t++) {
                const element2 = element.exemplos[t];
                card.fields.Back += `- ${element2.exemplo}:<br>`;
              }
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

          this.anexos.push(anexo);

          card.fields.Back += `<img src="${anexo.nome}" />`;
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
    this.mudarIcon();
  }

  mudarIcon() {
    var link = document.querySelector("link[rel~='icon']") as any;
    if (!link) {
        link = document.createElement('link') as any;
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    if(!this.mostrarLoader) {
      link.href = './../../../favicon.ico';
    }

    if(this.mostrarLoader) {
      link.href = './../../assets/loading.gif';
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
      // this.copyToClipboard(textoSelecionado);

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

  copyToClipboard(text: any) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
  }

  @HostListener('document:keydown.control.c', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    var textoSelecionado = window.getSelection()?.toString() ?? "";

    const regex = new RegExp('\\d{2}[:]\\d{2}[:]\\d{2}[,]\\d{3} - \\d{2}[:]\\d{2}[:]\\d{2}[,]\\d{3}', 'gm')
    textoSelecionado = textoSelecionado.replace(regex, ' ');

    while (textoSelecionado?.includes('\n') || textoSelecionado?.includes('  ')) {
      textoSelecionado = textoSelecionado.replace('\n', ' ');
      textoSelecionado = textoSelecionado.replace('  ', ' ');
    }
    textoSelecionado = textoSelecionado?.trim();
    this.copyToClipboard(textoSelecionado);

    event.preventDefault();
  }

  tocar(palavra: any) {
    var audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${palavra}`);
    audio.play();
  };
}
