import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { AnotacoesService } from './anotacoes.service';
import { AnotacoesComponent } from './anotacoes/anotacoes.component';

@NgModule({
  declarations: [
    AnotacoesComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [AnotacoesService]
})
export class AnotacoesModule { }
