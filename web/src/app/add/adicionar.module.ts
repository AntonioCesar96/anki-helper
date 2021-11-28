import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarComponent } from './adicionar/adicionar.component';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { AdicionarService } from './adicionar.service';

@NgModule({
  declarations: [
    AdicionarComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [AdicionarService]
})
export class AdicionarModule { }
