import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Adicionar2Component } from './adicionar/adicionar2.component';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { Adicionar2Service } from './adicionar2.service';

@NgModule({
  declarations: [
    Adicionar2Component
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [Adicionar2Service]
})
export class Adicionar2Module { }
