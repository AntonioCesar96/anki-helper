import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AnotacoesService } from '../anotacoes.service';

@Component({
  selector: 'app-anotacoes',
  templateUrl: './anotacoes.component.html',
  styleUrls: ['./anotacoes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnotacoesComponent implements OnInit {
  @ViewChild('elementoAnotacao') elementoAnotacao!: ElementRef;

  constructor(private adicionarService: AnotacoesService) { }

  ngOnInit(): void {

    this.adicionarService.obterKindle().subscribe(listaHighlights => {
      console.log(listaHighlights);

      for (let x = 0; x < listaHighlights.length; x++) {
        const element = listaHighlights[x];

      }

      var textoHtml = '';
      for (let i = 0; i < listaHighlights.length; i++) {
        const element = listaHighlights[i];

        var anotacoes = `${element.nomeDoLivro}<br><br>`;
        for (let x = 0; x < element.highlights.length; x++) {
          const highlight = element.highlights[x];

          anotacoes += `- <span style=" color: ${highlight.color}; ">${highlight.location}</span> - ${highlight.highlight}`;
          if(highlight.note) {
            anotacoes += `(${highlight.note})<br>`;
          } else {
            anotacoes += `<br>`;
          }
        }

        textoHtml += '<br><br><br><br><br>';
        textoHtml += anotacoes;
      }

      const elemento = this.elementoAnotacao.nativeElement;

      elemento.innerHTML = textoHtml; // + '<br><br>';
    });
  }
}
