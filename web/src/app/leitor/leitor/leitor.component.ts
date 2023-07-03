import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  mostrarNote = true;
  textarea = '';
  capitulos: any[] = [];

  livros: any[] = [];
  livro: any;
  highlight: any;
  pronunciasGoogle: any[] = [];

  constructor(
    private adicionarService: LeitorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,) {

    var livro = (this.activatedRoute.snapshot.queryParams as any).livro;
    if (livro) {
      localStorage.setItem('livroSelecionado', livro);
    }

    this.livros = new LivrosClasse().livros;
    this.pronunciasGoogle = JSON.parse(localStorage.getItem('pronuncias') || '[]');
  }

  ngOnInit(): void {
    let livroSelecionado = localStorage.getItem('livroSelecionado');
    this.livro = livroSelecionado ? this.livros.find(x => x.nome === livroSelecionado) : new LivrosClasse().livros[0];

    let pageYOffset = this.adicionarService.obterParametro(this.livro, 'pageYOffset');
    if (pageYOffset) {
      this.pageYOffset = Number.parseInt(pageYOffset);
    }

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
      }, 4000);

    });
  }

  obterLivros(biblia: boolean) {
    if (!biblia) {
      return this.livros.filter(x => x.biblia === false || !x.biblia);
    }

    return this.livros.filter(x => x.biblia === biblia);
  }

  changeLivro(value: any) {
    const queryParams: Params = { livro: value };

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
      });

    setTimeout(() => {
      location.reload();
    }, 100);
  }

  createPaginacao(elemento: any) {
    let tableContents = elemento.querySelectorAll(this.livro.seletorPaginacao);

    // console.log(tableContents);
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
    let wrappers = document.querySelectorAll('.balao-quadrinhos-remover');
    for (let i = 0; i < wrappers.length; i++) {
      wrappers[i].parentElement.removeAttribute('data-line');
      wrappers[i].parentElement.removeChild(wrappers[i]);
    }

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

  removerPronuncias(): void {
    let wrappers = document.querySelectorAll('span[data-pro]');
    for (let i = 0; i < wrappers.length; i++) {
      wrappers[i].removeAttribute('data-pro');
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

      range.setStart(selection.focusNode, 0);
      range.setEnd(selection.anchorNode, (selection.anchorNode as any).wholeText.length);

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      let selection = window.getSelection();
      let range = document.createRange();

      range.setStart(selection.anchorNode, 0);
      range.setEnd(selection.focusNode, (selection.focusNode as any).wholeText.length);

      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.removerAnotacaoAux(selection);

    this.colocarHighlight(selection);

  }

  salvarHighlight(selection: any) {
    let anchorNodeId = (selection.anchorNode.parentElement.attributes as any).id.value;
    let anchorOffset = selection.anchorOffset

    let focusNodeId = (selection.focusNode.parentElement.attributes as any).id.value;
    let focusOffset = selection.focusOffset;

    this.highlight = {
      anchorNodeId: anchorNodeId, anchorOffset: anchorOffset,
      focusNodeId: focusNodeId, focusOffset: focusOffset,
      highlight: selection?.toString(),
      comentario: this.highlight?.comentario
    }

    this.salvarParametro();

    return this.highlight;
  }

  obterComentarios() {
    let banco = this.adicionarService.obterParametro(this.livro, 'banco');
    // let banco = JSON.parse(bancoString || '{}');
    if (!banco) {
      banco = { lista: [] };
    }

    return banco;
  }

  salvarParametro() {
    let banco = this.obterComentarios();
    banco.lista.push(this.highlight);
    this.adicionarService.salvarParametro(this.livro, 'banco', banco);
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

  getMarksNodesBetween(rootNode: any, startNode: any, endNode: any) {
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

  removerAnotacao(anchorNodeId: any, focusNodeId: any) {

    const elemento = this.elementoAnotacao.nativeElement;
    let pai1 = elemento.querySelector(`#${anchorNodeId}`);
    let pai2 = elemento.querySelector(`#${focusNodeId}`);

    let marks = this.getMarksNodesBetween(document.body, pai1, pai2);

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
    console.log(event.code);

    if (event.code === 'Space') {
      if (!window.getSelection()?.toString()) {
        return;
      }

      event.preventDefault();
      this.marcarTexto();
      this.mostrarNote = true;
    }
    if (event.code === 'Backquote') {
      let selection = window.getSelection();

      this.removerAnotacaoAux(selection);
    }
    if (event.code === 'Numpad0') {
      this.recuperarComentario();
    }
    if (event.code === 'Numpad1') {
      this.removerPronuncias();
    }
    if (event.code === 'Numpad2') {
      let wrappers = document.querySelectorAll('.balao-quadrinhos-remover');
      for (let i = 0; i < wrappers.length; i++) {
        wrappers[i].parentElement.removeAttribute('data-line');
        wrappers[i].parentElement.removeChild(wrappers[i]);
      }
    }
    if (event.code === 'Numpad3') {

      let wrappers = document.querySelectorAll('.balao-quadrinhos');
      for (let i = 0; i < wrappers.length; i++) {
        wrappers[i].parentElement.removeChild(wrappers[i]);
      }
      return;
    }
  }

  recuperarComentario() {
    let selection = window.getSelection();

    let banco = this.obterComentarios();
    let lista = banco.lista as any[];
    let pai01 = (selection.anchorNode.parentElement.attributes as any)['data-pai1']?.value;
    this.highlight = lista.find(x => x.anchorNodeId === pai01);

    this.mostrarNote = true;
  }

  removerAnotacaoDoMeio(selection: any): void {

    let marks = this.getMarksNodesBetween(document.body, selection.anchorNode, selection.focusNode);

    for (let i = 0; i < marks.length; i++) {
      let mark = marks[i];

      let attributes = (mark.attributes as any);
      if (attributes && attributes['data-pai1']) {
        this.removerMarcacoes(attributes['data-pai1'].value, attributes['data-pai2'].value);
      }

      if (mark.className == "mark") {
        mark.classList.remove("mark");
        mark.removeAttribute('data-pai1');
        mark.removeAttribute('data-pai2');
      }
    }
  }

  removerAnotacaoAux(selection: any): void {

    this.removerAnotacaoDoMeio(selection);

    let parentElement = (selection.anchorNode.parentElement.attributes as any);
    let dataPai1: any;
    let dataPai2: any;
    if (parentElement && parentElement['data-pai1']) {
      dataPai1 = parentElement['data-pai1'].value;
      dataPai2 = parentElement['data-pai2'].value;

      this.removerMarcacoes(dataPai1, dataPai2);
      this.removerAnotacao(dataPai1, dataPai2);
    }

    parentElement = (selection.focusNode.parentElement.attributes as any);
    if (parentElement && parentElement['data-pai1']) {
      dataPai1 = parentElement['data-pai1'].value;
      dataPai2 = parentElement['data-pai2'].value;

      this.removerMarcacoes(dataPai1, dataPai2);
      this.removerAnotacao(dataPai1, dataPai2);
    }
  }

  removerMarcacoes(dataPai1: any, dataPai2: any) {
    let banco = this.obterComentarios();

    let lista = banco.lista as any[];
    this.highlight = lista.find(x => x.anchorNodeId === dataPai1 || x.anchorNodeId === dataPai2);

    if (this.highlight) {
      banco.lista = lista.filter(x => x.anchorNodeId !== this.highlight.anchorNodeId);
      this.adicionarService.salvarParametro(this.livro, 'banco', banco);

      const elemento = this.elementoAnotacao.nativeElement;
      let pai1 = elemento.querySelector(`#${this.highlight.anchorNodeId}`);

      pai1?.removeAttribute("data-note");

      this.salvarHtml();
    }
  }

  fecharNote() {
    this.mostrarNote = false;
    this.highlight = null;
  }

  salvarNote() {
    let banco = this.obterComentarios();
    let lista = banco.lista as any[];
    let highlightAux = lista.find(x => x.anchorNodeId === this.highlight.anchorNodeId);

    highlightAux.comentario = this.highlight.comentario;

    this.adicionarService.salvarParametro(this.livro, 'banco', banco);

    this.fecharNote();

    const elemento = this.elementoAnotacao.nativeElement;
    let pai1 = elemento.querySelector(`#${highlightAux.anchorNodeId}`);

    pai1?.setAttribute("data-note", highlightAux.comentario);

    this.salvarHtml();
  }

  mostrarPronuncia(ev: KeyboardEvent, palavraMarcada: any) {
    var existe = this.pronunciasGoogle.find(x => x.palavra === palavraMarcada)
    if (existe) {
      (ev.target as any).setAttribute("data-pro", existe.pronuncia);
      // this.mostrarEmTodasAsPalavras(palavraMarcada, existe.pronuncia);
      return;
    } 

    this.pronunciasGoogle.push({ palavra: palavraMarcada, pronuncia: '' });

    this.adicionarService.obterPronunciasObservable([palavraMarcada]).subscribe(pronuncias => {
      for (let g = 0; g < pronuncias.length; g++) {
        const pronuncia = pronuncias[g];

        var existe = this.pronunciasGoogle.find(x => x.palavra === palavraMarcada) as any;
        existe.pronuncia = pronuncia.pronuncia2;

        localStorage.setItem('pronuncias', JSON.stringify(this.pronunciasGoogle));

        (ev.target as any).setAttribute("data-pro", existe.pronuncia);

        // this.mostrarEmTodasAsPalavras(palavraMarcada, existe.pronuncia);
      }
    });
  }

  mostrarEmTodasAsPalavras(palavra: any, pronuncia: any) {
    const spans = document.querySelectorAll("span");
    const spansAux: any = [];
    for (let i = 0; i < spans.length; i++) {
      var text = spans[i].textContent.trim().replace('“', '').replace('”', '')
        .replace('.', '').replace(',', '').replace('—', '').replace(':', '').replace(';', '')
        .replace('!', '').replace('?', '').replace('"', '').replace(')', '').replace('(', '')
        .replace('-', '').replace('."', '')
        .toLocaleLowerCase();
      palavra = palavra.replace('“', '').replace('”', '')
        .replace('.', '').replace(',', '').replace('—', '').replace(':', '').replace(';', '')
        .replace('!', '').replace('?', '').replace('"', '').replace(')', '').replace('(', '')
        .replace('-', '').replace('."', '')
        .toLocaleLowerCase();

      if (text === palavra) {
        spansAux.push(spans[i]);
        console.log(text);
      }
    }

    for (let i = 0; i < spansAux.length; i++) {
      spansAux[i].setAttribute("data-pro", pronuncia);
    }

    console.log(spansAux);
  }

  removerAcentos(palavra: string) {
    palavra = palavra.trim().replace('“', '').replace('”', '')
      .replace('.', '').replace(',', '').replace('—', '').replace(':', '').replace(';', '')
      .replace('!', '').replace('?', '').replace('"', '').replace(')', '').replace('(', '')
      .replace('-', '').replace('."', '')

    return palavra;
  }

  // @HostListener('window:mousedown', ['$event'])
  handleKeyboardEvent(ev: any) {

    if (ev.ctrlKey && ev.which == 1) {
      let palavraMarcada = window.getSelection()?.toString() ?? "";
      let palavraClicada = palavraMarcada !== "" ? palavraMarcada : (ev.target as any).textContent;

      let elementoClicado = (ev.target as any);

      // if (elementoClicado.getAttribute("data-traducoes")) {
      //   if (!elementoClicado.querySelector('.balao-quadrinhos-remover')) {
      //     elementoClicado.setAttribute("data-line", true);

      //     var divElement = document.createElement('div');
      //     divElement.innerHTML = elementoClicado.getAttribute("data-traducoes");
      //     divElement.classList.add('balao-quadrinhos-remover');
      //     var spanElement = document.createElement('span');
      //     spanElement.innerHTML = " ";

      //     elementoClicado.appendChild(spanElement);
      //     elementoClicado.appendChild(divElement);
      //   }
      //   return;
      // }

      palavraClicada = this.removerAcentos(palavraClicada);

      this.adicionarService.obterTraducoes([palavraClicada]).subscribe(traducoes => {

        if (!elementoClicado.querySelector('.balao-quadrinhos-remover')) {

          elementoClicado.setAttribute("data-traducoes", traducoes[0]);
          elementoClicado.setAttribute("data-line", true);

          var divElement = document.createElement('div');
          divElement.innerHTML = traducoes;
          divElement.classList.add('balao-quadrinhos-remover');
          var spanElement = document.createElement('span');
          spanElement.innerHTML = " ";

          elementoClicado.appendChild(spanElement);
          elementoClicado.appendChild(divElement);
        }


        var divElement2 = document.createElement('div');
        divElement2.classList.add('balao-quadrinhos');
        var bElement = document.createElement('b');
        bElement.innerHTML = "#" + palavraClicada + "# ";
        spanElement = document.createElement('span');
        spanElement.innerHTML = traducoes[0];

        divElement2.appendChild(bElement);
        divElement2.appendChild(spanElement);
        // divElement2.setAttribute("title", traducoes[0]);

        var parentElement = document.querySelector('.balao-quadrinhos-wrap');
        var firstChild = parentElement.firstChild;

        parentElement.insertBefore(divElement2, firstChild);
      });
    }

    if (!ev.ctrlKey && ev.which == 3) {
      ev.preventDefault();

      let palavraMarcada = window.getSelection()?.toString() ?? "";
      let palavraClicada = (ev.target as any).innerHTML.split('<s')[0];

      palavraClicada = palavraClicada != null ? palavraClicada.split('<s')[0] : palavraClicada;

      this.mostrarPronuncia(ev, palavraClicada);

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

    if (ev.ctrlKey && ev.which == 3) {
      ev.preventDefault();

      let palavraMarcada = window.getSelection()?.toString() ?? "";
      if (!palavraMarcada) {
        return;
      }

      this.adicionarService.obterTraducao2(palavraMarcada)
        .then(traducao => {
          var divElement2 = document.createElement('div');
          divElement2.classList.add('balao-quadrinhos');

          var spanElement = document.createElement('span');
          spanElement.innerHTML = palavraMarcada + '<br/><hr>' + traducao;

          divElement2.appendChild(spanElement);

          var parentElement = document.querySelector('.balao-quadrinhos-wrap2');
          var firstChild = parentElement.firstChild;

          parentElement.insertBefore(divElement2, firstChild);
        });
    }
  }

}
