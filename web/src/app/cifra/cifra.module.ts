import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { CifraViewComponent } from './view/cifra.component';
import { CifraService } from './cifra.service';
import { CifraListaViewComponent } from './list/list.component';

@NgModule({
  declarations: [
    CifraViewComponent,
    CifraListaViewComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [CifraService]
})
export class CifraModule { }
