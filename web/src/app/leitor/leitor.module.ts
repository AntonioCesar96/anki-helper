import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { LeitorService } from './leitor.service';
import { LeitorComponent } from './leitor/leitor.component';

@NgModule({
  declarations: [
    LeitorComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [LeitorService]
})
export class LeitorModule { }
