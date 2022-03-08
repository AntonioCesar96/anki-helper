import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdicionarGramaticaComponent } from './add-gramatica/adicionar/adicionar.component';
import { AdicionarComponent } from './add/adicionar/adicionar.component';

const routes: Routes = [
  { path: 'mineracao', component: AdicionarComponent },
  { path: '**', component: AdicionarGramaticaComponent },
  { path: '', component: AdicionarGramaticaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
