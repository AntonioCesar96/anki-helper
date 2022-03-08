import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarGramaticaComponent } from './adicionar/adicionar.component';
import { AnkiHelperCommonModule } from '../_common/common.module';
import { AdicionarGramaticaService } from './adicionar.service';

@NgModule({
  declarations: [
    AdicionarGramaticaComponent
  ],
  imports: [
    AnkiHelperCommonModule
  ],
  providers: [AdicionarGramaticaService]
})
export class AdicionarGramaticaModule { }
