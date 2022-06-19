import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { LeitorService } from '../leitor.service';
import { LivrosClasse } from './livros';

@Component({
  selector: 'app-leitor',
  templateUrl: './leitor.component.html',
  styleUrls: ['./leitor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeitorComponent implements OnInit {
  @ViewChild('elementoAnotacao') elementoAnotacao!: ElementRef;
  pageYOffset = 0;
  mostrarCapitulos = false;
  capitulos: any[] = [];

  livro: any;

  constructor(private adicionarService: LeitorService) {
    this.livro = new LivrosClasse().livros[0];

    let pageYOffset = adicionarService.obterParametro(this.livro, 'pageYOffset');
    if (pageYOffset) {
      this.pageYOffset = Number.parseInt(pageYOffset);
    }
  }

  ngOnInit(): void {

    this.adicionarService.obterKindle(this.livro).subscribe(ebook => {
      const elemento = this.elementoAnotacao.nativeElement;
      elemento.innerHTML = ebook.conteudo; // + '<br><br>';

      this.addSpan(elemento);

      this.createPaginacao(elemento);

      for (let i = 0; i < ebook.conteudoArquivosCss.length; i++) {
        let css = ebook.conteudoArquivosCss[i];
        let head = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
      }

      setTimeout(() => {
        let capitulo = this.adicionarService.obterParametro(this.livro, 'capitulo');
        this.mostrarCapitulo(capitulo);
        window.scrollTo(0, this.pageYOffset);
      }, 1000);

    });
  }

  createPaginacao(elemento: any) {
    let tableContents = elemento.querySelectorAll(this.livro.seletorPaginacao);

    for (let i = 0; i < tableContents.length; i++) {
      let element = tableContents[i];
      let href = (element.attributes as any).href.value;

      let capituloConteudo = elemento.querySelector(href);
      if (!capituloConteudo) {
        continue;
      }

      this.capitulos.push({
        href: href,
        capitulo: element.textContent,
        capituloConteudo: capituloConteudo.innerHTML
      });

    }
  }
  mostrarCapituloAux(href: any) {
    this.mostrarCapitulo(href);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }

  mostrarCapitulo(href: any) {
    const elemento = this.elementoAnotacao.nativeElement;
    this.adicionarService.salvarParametro(this.livro, 'capitulo', href);

    for (let i = 0; i < this.capitulos.length; i++) {
      let element = this.capitulos[i];

      let capituloConteudo = elemento.querySelector(element.href);
      if (element.href === href) {
        capituloConteudo.classList.remove("hide");
        //this.proximoIrmao(capituloConteudo.nextElementSibling, false);
        continue;
      }

      capituloConteudo.classList.add("hide");
      //this.proximoIrmao(capituloConteudo.nextElementSibling, true);
    }

    for (let i = 0; i < this.livro.idsEsconder.length; i++) {
      let element = this.livro.idsEsconder[i];
      elemento.querySelector(element)?.classList.add("hide");
    }

    this.mostrarCapitulos = false;
  }

  proximoIrmao(nextElementSibling: any, esconder: boolean): boolean {
    if (nextElementSibling?.nodeName === 'SPAN') {
      return this.proximoIrmao(nextElementSibling.nextElementSibling, esconder);
    }

    if (esconder) {
      nextElementSibling?.classList.add("hide");
    } else {
      nextElementSibling?.classList.remove("hide");
    }
    return true;
  }

  salvarHtml() {
    setTimeout(() => {
      const elemento = this.elementoAnotacao.nativeElement;
      var obj = { livro: this.livro.nome, innerHTML: elemento.innerHTML }
      this.adicionarService.salvarHtml(obj)
        .subscribe(res => {

        });
    }, 1000);
  }

  addSpan(elemento: any) {
    let span1 = elemento.querySelector('#s1');
    if (span1) {
      return;
    }

    let todosTextNodes = this.textNodesUnder(elemento);
    let id = 0;
    for (let i = 0; i < todosTextNodes.length; i++) {
      let nodeDoMeio = todosTextNodes[i];

      let splits = nodeDoMeio.data.split(/(\s+)/);
      let novoHtml = '';
      for (let x = 0; x < splits.length; x++) {
        id++;
        novoHtml += '<span id="s' + id + '">' + splits[x] + '</span>';
      }

      // let novoHtml = nodeDoMeio.data.replace(/\w+/g, "<span>$&</span>");

      let span3 = document.createElement('span');
      span3.innerHTML = `<span>${novoHtml}</span>`;

      nodeDoMeio.parentNode.insertBefore(span3, nodeDoMeio);
      nodeDoMeio.parentNode.removeChild(nodeDoMeio);
    }

    this.salvarHtml();
  }

  textNodesUnder(node: any) {
    let all: any = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == 3) all.push(node);
      else all = all.concat(this.textNodesUnder(node));
    }
    return all;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.adicionarService.salvarParametro(this.livro, 'pageYOffset', window.pageYOffset.toString());
  }

  /*
  @HostListener('window:mouseup', ['$event'])
  handleKeyboardEventMouseup(ev: KeyboardEvent) {
    console.log(ev);
    let palavraMarcada = window.getSelection()?.toString() ?? "";
    if (!palavraMarcada) {
      return;
    }

    let spanId = window.getSelection().focusNode.parentElement;

    let div = this.renderer.createElement('div'); //dynamically create element

    div.classList.add("cores-wrapper");

    div.innerHTML = `
        <div class="cores">
          <div class="cor amarelo"></div>
          <div class="cor azul"></div>
        </div>`;

    this.renderer.appendChild(spanId, div);

this.renderer.listen(div, 'click', (event) => {
  console.log("test");
});

    // setTimeout(() => {
    //   let thisThis = this;
    //   let amarelo = document.querySelector('.cores .amarelo') as any;
    //   amarelo.addEventListener('click', function () { thisThis.marcarTexto(); });
    // }, 1000);


  }
*/

  @HostListener('window:mousedown', ['$event'])
  handleKeyboardEvent(ev: KeyboardEvent) {
    let wrappers = document.querySelectorAll('.cores-wrapper');
    for (let i = 0; i < wrappers.length; i++) {
      wrappers[i].parentElement.removeChild(wrappers[i]);
    }

    if (ev.which == 2) {
      ev.preventDefault();

      if (ev.which == 2) {
        let palavraMarcada = window.getSelection()?.toString() ?? "";
        let palavraClicada = (ev.target as any).textContent;

        if (palavraMarcada) {
          let audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${palavraMarcada}`);
          audio.play();
          return;
        }

        if (palavraClicada) {
          let audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${palavraClicada}`);
          audio.play();
        }
      }
    }
  }

  marcarTexto(): void {
    let selection = window.getSelection();
    let palavra = selection?.toString() ?? "";
    if (!palavra) {
      return;
    }

    function selectionIsBackwards() {
      let sel = window.getSelection();

      let range = document.createRange();
      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);

      let backwards = range.collapsed;
      range.detach();
      return backwards;
    }

    if (selectionIsBackwards()) {
      let selection = window.getSelection();
      let range = document.createRange();

      range.setEnd(selection.anchorNode, selection.anchorOffset);
      range.setStart(selection.focusNode, selection.focusOffset);

      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.removerAnotacaoAux(selection);

    this.colocarHighlight(selection);

  }

  removerAnotacaoAux(selection: any): void {
    let parentElement = (selection.anchorNode.parentElement.attributes as any);
    if (parentElement && parentElement['data-pai1']) {
      let dataPai1 = parentElement['data-pai1'].value;
      let dataPai2 = parentElement['data-pai2'].value;

      this.removerAnotacao(dataPai1, dataPai2);
    }

    parentElement = (selection.focusNode.parentElement.attributes as any);
    if (parentElement && parentElement['data-pai1']) {
      let dataPai1 = parentElement['data-pai1'].value;
      let dataPai2 = parentElement['data-pai2'].value;

      this.removerAnotacao(dataPai1, dataPai2);
    }
  }

  salvarHighlight(selection: any) {
    let anchorNodeId = (selection.anchorNode.parentElement.attributes as any).id.value;
    let anchorOffset = selection.anchorOffset

    let focusNodeId = (selection.focusNode.parentElement.attributes as any).id.value;
    let focusOffset = selection.focusOffset;

    let bancoString = this.adicionarService.obterParametro(this.livro, 'banco');
    let banco = JSON.parse(bancoString || '{}');
    if (!banco.lista) {
      banco = { lista: [] };
    }

    let highlight = {
      anchorNodeId: anchorNodeId, anchorOffset: anchorOffset,
      focusNodeId: focusNodeId, focusOffset: focusOffset,
      highlight: selection?.toString()
    }
    banco.lista.push(highlight);

    this.adicionarService.salvarParametro(this.livro, 'banco', JSON.stringify(banco));

    return highlight;
  }

  colocarHighlight(selection: any) {
    let highlight = this.salvarHighlight(selection);

    this.colocarHighlightNodesDoMeio(selection, highlight);

    if (selection.anchorNode !== selection.focusNode) {
      this.colocarHighlightNodeDiferente(selection, highlight);
    } if (selection.anchorNode === selection.focusNode) {
      this.colocarHighlightMesmoNode(selection, highlight);
    }

    this.salvarHtml();
    window.getSelection().removeAllRanges();
  }

  colocarHighlightMesmoNode(selection: any, highlight: any) {
    let texto = (selection.anchorNode as any).wholeText.substring(selection.anchorOffset, selection.focusOffset);

    this.manipularNode(selection.anchorNode, texto, highlight);
  }

  colocarHighlightNodeDiferente(selection: any, highlight: any) {
    let texto01 = (selection.anchorNode as any).wholeText.substring(selection.anchorOffset, (selection.anchorNode as any).wholeText.length);
    this.manipularNode(selection.anchorNode, texto01, highlight);

    let texto02 = (selection.focusNode as any).wholeText.substring(0, selection.focusOffset);
    this.manipularNode(selection.focusNode, texto02, highlight);
  }

  colocarHighlightNodesDoMeio(selection: any, highlight: any) {
    function getTextNodesBetween(rootNode: any, startNode: any, endNode: any) {
      if (startNode === endNode) {
        return [];
      }

      let pastStartNode = false, reachedEndNode = false, textNodes: any = [];

      function getTextNodes(node: any) {
        if (node == startNode) {
          pastStartNode = true;
        } else if (node == endNode) {
          reachedEndNode = true;
        } else if (node.nodeType == 3) {
          //if (pastStartNode && !reachedEndNode && !/^\s*$/.test(node.nodeValue)) {
          if (pastStartNode && !reachedEndNode) {
            textNodes.push(node);
          }
        } else {
          for (let i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
            getTextNodes(node.childNodes[i]);
          }
        }
      }

      getTextNodes(rootNode);
      return textNodes;
    }

    let textNodes = getTextNodesBetween(document.body, selection.anchorNode, selection.focusNode);

    for (let i = 0; i < textNodes.length; i++) {
      let nodeDoMeio = textNodes[i];
      this.manipularNode(nodeDoMeio, nodeDoMeio.wholeText, highlight);
    }
  }

  manipularNode(node: any, texto: any, highlight: any) {
    node.parentNode.classList.add("mark");
    node.parentNode.setAttribute("data-pai1", highlight.anchorNodeId);
    node.parentNode.setAttribute("data-pai2", highlight.focusNodeId);
  }

  removerAnotacao(anchorNodeId: any, focusNodeId: any) {

    const elemento = this.elementoAnotacao.nativeElement;
    let pai1 = elemento.querySelector(`#${anchorNodeId}`);
    let pai2 = elemento.querySelector(`#${focusNodeId}`);

    function getTextNodesBetween(rootNode: any, startNode: any, endNode: any) {
      if (startNode === endNode) {
        return [];
      }

      let pastStartNode = false, reachedEndNode = false, textNodes: any = [startNode, endNode];

      function getTextNodes(node: any) {
        if (node == startNode) {
          pastStartNode = true;
        } else if (node == endNode) {
          reachedEndNode = true;
        } else if (node.className == "mark") {
          //if (pastStartNode && !reachedEndNode && !/^\s*$/.test(node.nodeValue)) {
          if (pastStartNode && !reachedEndNode) {
            textNodes.push(node);
          }
        } else {
          for (let i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
            getTextNodes(node.childNodes[i]);
          }
        }
      }

      getTextNodes(rootNode);
      return textNodes;
    }

    let marks = getTextNodesBetween(document.body, pai1, pai2);

    for (let i = 0; i < marks.length; i++) {
      let mark = marks[i];
      mark.classList.remove("mark");
      mark.removeAttribute('data-pai1');
      mark.removeAttribute('data-pai2');
    }



    this.salvarHtml();
  }

  @HostListener('window:keypress', ['$event'])
  handleKeyboardEventKeypress(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      this.marcarTexto();
    }
    if (event.code === 'Backquote') {
      let selection = window.getSelection();

      this.removerAnotacaoAux(selection);
    }
  }
}
