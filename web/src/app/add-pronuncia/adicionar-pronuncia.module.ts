import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { AdicionarPronunciaComponent } from './adicionar/adicionar-pronuncia.component';
import { AdicionarPronunciaService } from './adicionar-pronuncia.service';

@NgModule({
  declarations: [
    AdicionarPronunciaComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [AdicionarPronunciaService]
})
export class AdicionarPronunciaModule { }
