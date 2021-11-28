import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdicionarComponent } from './add/adicionar/adicionar.component';

const routes: Routes = [
  { path: '', component: AdicionarComponent },
  { path: '**', component: AdicionarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
