import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Adicionar2Component } from './add-2/adicionar/adicionar2.component';
import { AdicionarPronunciaComponent } from './add-pronuncia/adicionar/adicionar-pronuncia.component';
import { AdicionarComponent } from './add/adicionar/adicionar.component';

const routes: Routes = [
  { path: 'mineracao', component: AdicionarComponent },
  { path: 'pronuncia', component: AdicionarPronunciaComponent },
  { path: '**', component: Adicionar2Component },
  { path: '', component: Adicionar2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
