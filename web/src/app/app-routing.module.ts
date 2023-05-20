import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Adicionar2Component } from './add-2/adicionar/adicionar2.component';
import { AdicionarPortuguesComponent } from './add-portugues/adicionar/add-portugues.component';
import { AdicionarPronunciaComponent } from './add-pronuncia/adicionar/adicionar-pronuncia.component';
import { CifraListaViewComponent } from './cifra/list/list.component';
import { CifraViewComponent } from './cifra/view/cifra.component';
import { LeitorComponent } from './leitor/leitor/leitor.component';
import { AnotacoesComponent } from './lista-anotacoes-kindle/anotacoes/anotacoes.component';

const routes: Routes = [
  { path: 'anotacoes', component: AnotacoesComponent },
  { path: 'leitor', component: LeitorComponent },
  { path: 'italk', component: AdicionarPronunciaComponent },
  { path: 'portugues', component: AdicionarPortuguesComponent },
  { path: 'cifras', component: CifraListaViewComponent },
  { path: 'cifra-view', component: CifraViewComponent },
  { path: '**', component: Adicionar2Component },
  { path: '', component: Adicionar2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
