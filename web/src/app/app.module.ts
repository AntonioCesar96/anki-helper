import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnkiHelperCommonModule } from './_common/common.module';
import { AdicionarGramaticaModule } from './add-gramatica/adicionar.module';
import { Adicionar2Module } from './add-2/adicionar.module';
import { AdicionarPronunciaModule } from './add-pronuncia/adicionar-pronuncia.module';
import { AdicionarPortuguesModule } from './add-portugues/add-portugues.module';
import { AnotacoesModule } from './lista-anotacoes-kindle/anotacoes.module';
import { LeitorModule } from './leitor/leitor.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AnkiHelperCommonModule,
    AnotacoesModule,
    AdicionarGramaticaModule,
    Adicionar2Module,
    AppRoutingModule,
    AdicionarPronunciaModule,
    AdicionarPortuguesModule,
    LeitorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
