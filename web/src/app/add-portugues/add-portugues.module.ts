import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { AdicionarPortuguesComponent } from './adicionar/add-portugues.component';
import { AdicionarPortuguesService } from './add-portugues.service';

@NgModule({
  declarations: [
    AdicionarPortuguesComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [AdicionarPortuguesService ]
})
export class AdicionarPortuguesModule { }
