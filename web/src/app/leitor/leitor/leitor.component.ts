import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LeitorService } from '../leitor.service';

@Component({
  selector: 'app-leitor',
  templateUrl: './leitor.component.html',
  styleUrls: ['./leitor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeitorComponent implements OnInit {
  @ViewChild('elementoAnotacao') elementoAnotacao!: ElementRef;
  pageYOffset = 0;

  constructor(private adicionarService: LeitorService) {

    var pageYOffset = localStorage.getItem('pageYOffset');
    if (pageYOffset) {
      this.pageYOffset = Number.parseInt(pageYOffset);
    }
  }

  ngOnInit(): void {

    this.adicionarService.obterKindle().subscribe(ebook => {
      const elemento = this.elementoAnotacao.nativeElement;
      elemento.innerHTML = ebook.conteudo; // + '<br><br>';

      this.addSpan(elemento);

      for (let i = 0; i < ebook.conteudoArquivosCss.length; i++) {
        var css = ebook.conteudoArquivosCss[i];
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        head.appendChild(style);
        style.appendChild(document.createTextNode(css));
      }

      setTimeout(() => {
        window.scrollTo(0, this.pageYOffset);
      }, 1000);

    });
  }

  salvarHtml() {
    setTimeout(() => {
      const elemento = this.elementoAnotacao.nativeElement;

      this.adicionarService.salvarHtml(elemento.innerHTML)
        .subscribe(res => {

        });
    }, 1000);
  }

  addSpan(elemento: any) {
    var span1 = elemento.querySelector('#span1');
    if (span1) {
      return;
    }

    var todosTextNodes = this.textNodesUnder(elemento);
    var id = 0;
    for (var i = 0; i < todosTextNodes.length; i++) {
      var nodeDoMeio = todosTextNodes[i];

      var splits = nodeDoMeio.data.split(/(\s+)/);
      var novoHtml = '';
      for (var x = 0; x < splits.length; x++) {
        id++;
        novoHtml += '<span id="span' + id + '">' + splits[x] + '</span>';
      }

      // var novoHtml = nodeDoMeio.data.replace(/\w+/g, "<span>$&</span>");

      var span3 = document.createElement('span');
      span3.innerHTML = `<span>${novoHtml}</span>`;

      nodeDoMeio.parentNode.insertBefore(span3, nodeDoMeio);
      nodeDoMeio.parentNode.removeChild(nodeDoMeio);
    }

    this.salvarHtml();
  }

  textNodesUnder(node: any) {
    var all: any = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
      if (node.nodeType == 3) all.push(node);
      else all = all.concat(this.textNodesUnder(node));
    }
    return all;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    localStorage.setItem('pageYOffset', window.pageYOffset.toString());
  }

  @HostListener('window:mousedown', ['$event'])
  handleKeyboardEvent(ev: KeyboardEvent) {
    if (ev.which == 2) {
      ev.preventDefault();

      if (ev.which == 2) {
        var palavraMarcada = window.getSelection()?.toString() ?? "";
        var palavraClicada = (ev.target as any).textContent;

        if (palavraMarcada) {
          var audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${palavraMarcada}`);
          audio.play();
          return;
        }

        console.log(ev);
        if (palavraClicada) {
          var audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${palavraClicada}`);
          audio.play();
        }
      }
    }

    if (ev.which == 3) {
      ev.preventDefault();
      this.marcarTexto();
    }

  }

  marcarTexto(): void {
    var selection = window.getSelection();
    var palavra = selection?.toString() ?? "";
    if (!palavra) {
      return;
    }

    var parentElement = (selection.anchorNode.parentElement.attributes as any);
    if (parentElement && parentElement['data-pai1']) {
      var dataPai1 = parentElement['data-pai1'].value;
      var dataPai2 = parentElement['data-pai2'].value;

      this.removerAnotacao(dataPai1, dataPai2);

    }

    this.colocarHighlight(selection);

  }

  salvarHighlight(selection: any) {
    var anchorNodeId = (selection.anchorNode.parentElement.attributes as any).id.value;
    var anchorOffset = selection.anchorOffset

    var focusNodeId = (selection.focusNode.parentElement.attributes as any).id.value;
    var focusOffset = selection.focusOffset;

    var bancoString = localStorage.getItem('banco');
    var banco = JSON.parse(bancoString);
    if (!banco) {
      banco = { lista: [] };
    }

    var highlight = {
      anchorNodeId: anchorNodeId, anchorOffset: anchorOffset,
      focusNodeId: focusNodeId, focusOffset: focusOffset,
      highlight: selection?.toString()
    }
    banco.lista.push(highlight);

    localStorage.setItem('banco', JSON.stringify(banco));

    return highlight;
  }

  colocarHighlight(selection: any) {
    var highlight = this.salvarHighlight(selection);

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
    var texto = (selection.anchorNode as any).wholeText.substring(selection.anchorOffset, selection.focusOffset);

    this.manipularNode(selection.anchorNode, texto, highlight);
  }

  colocarHighlightNodeDiferente(selection: any, highlight: any) {
    var texto01 = (selection.anchorNode as any).wholeText.substring(selection.anchorOffset, (selection.anchorNode as any).wholeText.length);
    this.manipularNode(selection.anchorNode, texto01, highlight);

    var texto02 = (selection.focusNode as any).wholeText.substring(0, selection.focusOffset);
    this.manipularNode(selection.focusNode, texto02, highlight);
  }

  colocarHighlightNodesDoMeio(selection: any, highlight: any) {
    function getTextNodesBetween(rootNode: any, startNode: any, endNode: any) {
      if (startNode === endNode) {
        return [];
      }

      var pastStartNode = false, reachedEndNode = false, textNodes: any = [];

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
          for (var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
            getTextNodes(node.childNodes[i]);
          }
        }
      }

      getTextNodes(rootNode);
      return textNodes;
    }

    var textNodes = getTextNodesBetween(document.body, selection.anchorNode, selection.focusNode);

    for (var i = 0; i < textNodes.length; i++) {
      var nodeDoMeio = textNodes[i];
      this.manipularNode(nodeDoMeio, nodeDoMeio.wholeText, highlight);
    }
  }

  manipularNode(node: any, texto: any, highlight: any) {
    var span = document.createElement('span');
    var idMark = 'm' + ((+new Date) + Math.random() * 100).toString(32).replace('.', '');
    span.innerHTML = (node as any).wholeText.replace(texto,
      `<mark id="${idMark}" data-pai1="${highlight.anchorNodeId}" data-pai2="${highlight.focusNodeId}">${texto}</mark>`);

    node.parentNode.insertBefore(span, node);
    node.parentNode.removeChild(node);
  }

  removerAnotacao(anchorNodeId: any, focusNodeId: any) {

    const elemento = this.elementoAnotacao.nativeElement;
    var pai1 = elemento.querySelector(`#${anchorNodeId} mark`);
    var pai2 = elemento.querySelector(`#${focusNodeId} mark`);

    function getTextNodesBetween(rootNode: any, startNode: any, endNode: any) {
      if (startNode === endNode) {
        return [];
      }

      var pastStartNode = false, reachedEndNode = false, textNodes: any = [];

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
          for (var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
            getTextNodes(node.childNodes[i]);
          }
        }
      }

      getTextNodes(rootNode);
      return textNodes;
    }

    function findAncestor(el: any, sel: any) {
      while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, sel)));
      return el;
    }

    var marks = getTextNodesBetween(document.body, pai1, pai2);
    marks.push(pai1);
    marks.push(pai2);

    for (var i = 0; i < marks.length; i++) {
      var mark = marks[i];

      var spanComId = findAncestor(mark, 'span[id^="span"')
      var textContent = document.createTextNode(spanComId.innerText);

      spanComId.innerHTML = '';
      spanComId.appendChild(textContent);
    }

    window.getSelection().removeAllRanges();
    this.salvarHtml();
  }

  @HostListener('window:keypress', ['$event'])
  handleKeyboardEventKeypress(event: KeyboardEvent) {
    if (event.code === 'Backquote') {
      var selection = window.getSelection();

      var parentElement = (selection.anchorNode.parentElement.attributes as any);
      if (parentElement && parentElement['data-pai1']) {
        var dataPai1 = parentElement['data-pai1'].value;
        var dataPai2 = parentElement['data-pai2'].value;

        this.removerAnotacao(dataPai1, dataPai2);
      }
    }
  }
}
