import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdicionarModule } from './add/adicionar.module';
import { AnkiHelperCommonModule } from './_common/common.module';
import { AdicionarGramaticaModule } from './add-gramatica/adicionar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AnkiHelperCommonModule,
    AdicionarModule,
    AdicionarGramaticaModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
