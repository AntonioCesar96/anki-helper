import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Imagem, Pronuncia, RootObject, Significado, Traducao, Cartao, Anexo } from 'src/app/_common/models/models';
import { AdicionarService } from '../adicionar.service';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdicionarComponent implements OnInit {
  @ViewChild('audioEl') audioEl!: ElementRef<HTMLAudioElement>;


  @ViewChild('ankiFront') ankiFront!: ElementRef;
  @ViewChild('ankiBack') ankiBack!: ElementRef;
  @ViewChild('ankiBackTraducao') ankiBackTraducao!: ElementRef;
  @ViewChild('ankiBackPronuncia') ankiBackPronuncia!: ElementRef;
  @ViewChild('ankiBackSignificado') ankiBackSignificado!: ElementRef;
  @ViewChild('ankiBackImagem') ankiBackImagem!: ElementRef;

  form!: FormGroup;
  rootObject!: RootObject; 
  traducoesSelecionadas: Traducao[] = []; 
  pronunciasSelecionadas: Pronuncia[] = []; 
  significadosSelecionados: Significado[] = []; 
  imagensSelecionadas: Imagem[] = []; 
  decks: string[] = []; 
  deckSelecionado: string = ''; 
  audiosSelecionados: Anexo[] = []; 

  constructor(
    private fb: FormBuilder, 
    private adicionarService: AdicionarService) { }

  ngOnInit(): void {
    this.criarForm();

    this.adicionarService.obterDecks()
    .subscribe(res => {
      if(res && res.length > 0) {
        this.decks = res;
        this.changeDeck(res[0]);
      }
    });
  }

  criarForm() {
    this.form = this.fb.group({
      palavra: ['resurfacing'],
      frase: [''],
    });
  }

    
  obterDefinicao() {
    if(!this.validarForm()) {
      return;
    }

    this.form.value.palavra = this.form.value.palavra.trim();
    this.adicionarService.obterDefinicao(this.form.value.palavra)
    .subscribe(res => {
      this.rootObject = res;
      this.playTTS(this.form.value.palavra);

      var traducoes = this.traducoesSelecionadas.filter(x => x.palavraFiltro === this.form.value.palavra);
      for (let i = 0; i < traducoes.length; i++) {
        const traducao = traducoes[i];
        var traducaoEncontrada = this.rootObject.traducoes.find(x => x.traducao === traducao.traducao);
        if(traducaoEncontrada) {
          traducaoEncontrada.checked = traducao.checked;
        }
      }
    });
  }

  playTTS(text: any) {
    const url= `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${text}`;
    const elemento = this.audioEl.nativeElement;
    elemento.src = url;
 };

 obterAudio() {
  var anexo = new Anexo();
  anexo.nome = 'a' + ((+new Date) + Math.random()* 100).toString(32).replace('.', '');
  anexo.url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${window.getSelection()}`;

  this.audiosSelecionados.push(anexo);

  var audio = new Audio(anexo.url);
  audio.play();

  this.insertHtmlAfterSelection(' <a id="'+anexo.nome+'" class="btn btn-primary"><span class="audio"></span></a> ')
  setTimeout(() => {
    const elementoAnkiFront = this.ankiFront.nativeElement;
    var el = elementoAnkiFront.querySelector('#' + anexo.nome);
    if(el) {
      el.addEventListener('click', () => {this.tocar(anexo.nome)}); 
    }
  }, 500);
 }

 tocar(nome: any) {
  var audioEncontrado = this.audiosSelecionados.find(x => x.nome === nome);
  if(audioEncontrado) {
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
          if(rageAUx) {
            range = rageAUx.getRangeAt(0);
            expandedSelRange = range.cloneRange();
            range.collapse(false);
  
            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
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
  
  validarForm() {
    if (!this.form.value.palavra) {
      return false;
    }

    return true;
  }

  // TODO: Agrupar assim { regiao: "US, UK", pronuncia: "/dɪsˈɡaɪz/", regiao: "US", pronuncia: "/dɪsˈɡAɪz/"}
  changePronuncia(pronuncia: Pronuncia) {
    pronuncia.checked = !pronuncia.checked
    if(pronuncia.checked) {
      this.pronunciasSelecionadas.push(pronuncia);
    } else {
      const index = this.pronunciasSelecionadas.indexOf(pronuncia, 0);
      if (index > -1) {
        this.pronunciasSelecionadas.splice(index, 1);
      }
    }

    const elemento = this.ankiBackPronuncia.nativeElement;

    if(!this.pronunciasSelecionadas.some(x => x.checked)) {
      elemento.innerHTML = "";
      return;
    }

    var texto = this.pronunciasSelecionadas.map(x => x.pronuncia).join(', ');
    elemento.innerHTML = texto;
  }

  changeTraducao(traducao: Traducao) {
    traducao.checked = !traducao.checked
    traducao.palavraFiltro = this.form.value.palavra;

    if(traducao.checked) {
      this.traducoesSelecionadas.push(traducao);
    } else {
      var traducaoEncontrada = this.traducoesSelecionadas.find(x => x.traducao === traducao.traducao);
      if(traducaoEncontrada) {
        const index = this.traducoesSelecionadas.indexOf(traducaoEncontrada, 0);
        if (index > -1) {
          this.traducoesSelecionadas.splice(index, 1);
        }
      }
    }

    const elemento = this.ankiBackTraducao.nativeElement;

    if(!this.traducoesSelecionadas.some(x => x.checked)) {
      elemento.innerHTML = "";
      return;
    }

    var palavras = this.traducoesSelecionadas.map(x => x.palavraFiltro)
      .filter((v,i,a)=>a.findIndex(t=>(t === v))===i);

    var textoHtml = '';
    for (let i = 0; i < palavras.length; i++) {
      const palavra = palavras[i];

      var traducoes = this.traducoesSelecionadas.filter(x => x.palavraFiltro === palavra);
      textoHtml += `<b>${palavra}:</b> `;
      textoHtml += traducoes.map(x => x.traducao).join(', ');
      if(i < (palavras.length - 1)) {
        textoHtml += '<br>';
      }
    }

    elemento.innerHTML = textoHtml;
  }

  changeSignificado(significado: Significado) {
    significado.checked = !significado.checked
    if(significado.checked) {
      this.significadosSelecionados.push(significado);
    } else {
      const index = this.significadosSelecionados.indexOf(significado, 0);
      if (index > -1) {
        this.significadosSelecionados.splice(index, 1);
      }
    }

    const elemento = this.ankiBackSignificado.nativeElement;

    if(!this.significadosSelecionados.some(x => x.checked)) {
      elemento.innerHTML = "";
      return;
    }

    var texto = this.significadosSelecionados.map(x => '- ' + x.definicao).join('<br>');
    elemento.innerHTML = texto;
  }

  changeImagem(imagem: Imagem) {
    imagem.checked = !imagem.checked
    if(imagem.checked) {
      this.imagensSelecionadas.push(imagem);
    } else {
      const index = this.imagensSelecionadas.indexOf(imagem, 0);
      if (index > -1) {
        this.imagensSelecionadas.splice(index, 1);
      }
    }

    const elemento = this.ankiBackImagem.nativeElement;

    if(!this.imagensSelecionadas.some(x => x.checked)) {
      elemento.innerHTML = "";
      return;
    }

    var texto = this.imagensSelecionadas.map(x => `<img src="${x.src}" />`).join(' ');
    elemento.innerHTML = texto;
  }

  changeDeck(value: any) {
    this.deckSelecionado = value;
  }

  limpar() {
    window.location.reload();
  }

  adicionar() {
    const elementoAnkiFront = this.ankiFront.nativeElement;
    const elementoAnkiBack = this.ankiBack.nativeElement;

    var cartao = new Cartao(); 

    cartao.deckName = this.deckSelecionado;
    cartao.front = elementoAnkiFront.innerHTML;
    cartao.back = elementoAnkiBack.innerHTML;
    cartao.anexos = [];

    for (let i = 0; i < this.imagensSelecionadas.length; i++) {
      const imagem = this.imagensSelecionadas[i];

      var anexo = new Anexo();
      anexo.nome = ((+new Date) + Math.random()* 100).toString(32).replace('.', '') + '.jpg';
      anexo.url = imagem.src.replace('&', '&amp;');

      cartao.back = cartao.back.replace(anexo.url, anexo.nome);
      cartao.anexos.push(anexo);
    }

    for (let i = 0; i < this.audiosSelecionados.length; i++) {
      const audio = this.audiosSelecionados[i];

      var anexo = new Anexo();
      anexo.nome = audio.nome + '.mp3';
      anexo.url = audio.url;

      var replace = '<a id="'+audio.nome+'" class="btn btn-primary"><span class="audio"></span></a>';
      cartao.front = cartao.front.replace(replace, '[sound:'+anexo.nome+']');
      cartao.back = cartao.back.replace(replace, '[sound:'+anexo.nome+']');
      cartao.anexos.push(anexo);
    }

    this.adicionarService.criarCartao(cartao).subscribe(res => {
      if(!res.error) {
        this.limpar();
      }
    });
  }
}
