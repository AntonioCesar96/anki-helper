import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Imagem, Pronuncia, RootObject, Significado, Traducao, Cartao, Anexo } from 'src/app/_common/models/models';
import { AdicionarService } from '../adicionar.service';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss']
})
export class AdicionarComponent implements OnInit {
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
      palavra: [''],
      frase: [''],
    });
  }

    
  obterDefinicao() {
    if(!this.validarForm()) {
      return;
    }

    this.adicionarService.obterDefinicao(this.form.value.palavra)
    .subscribe(res => {
      this.rootObject = res;      
    });
    
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
    if(traducao.checked) {
      this.traducoesSelecionadas.push(traducao);
    } else {
      const index = this.traducoesSelecionadas.indexOf(traducao, 0);
      if (index > -1) {
        this.traducoesSelecionadas.splice(index, 1);
      }
    }

    const elemento = this.ankiBackTraducao.nativeElement;

    if(!this.traducoesSelecionadas.some(x => x.checked)) {
      elemento.innerHTML = "";
      return;
    }

    var palavra = `<b>${this.rootObject.palavra}:</b> `;
    var texto = palavra + this.traducoesSelecionadas.map(x => x.traducao).join(', ');
    elemento.innerHTML = texto;
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

    this.adicionarService.criarCartao(cartao).subscribe(res => {
      if(!res.error) {
        this.limpar();
      }
    });
  }
}
