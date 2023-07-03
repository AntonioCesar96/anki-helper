import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Cartao, RootObject } from '../_common/models/models';
import { ServerHelper } from '../server';

@Injectable()
export class LeitorService {

  URL_BASE = `http://${ServerHelper.ip}:3000`;

  constructor(
    private http: HttpClient
  ) { }

  obterKindle(livro: any): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.get<any>(`${this.URL_BASE}/kindle/leitor?livro=${livro.nome}`, { headers: headers })
  }

  obterTraducao(frase: any): Observable<any> {
    let headers = new HttpHeaders();
    // headers = headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36');
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=';
    return this.http.get<any>(`${url}${frase}`, { headers: headers });
  }

  async obterTraducao2(frase: any): Promise<any> {
    let headers = new HttpHeaders();
    // headers = headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36');
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=';

    var res = await firstValueFrom(this.http.get<any>(`${url}${frase}`, { headers: headers }));

    var traducao = '';
    if (res && res[0] && res[0][0]) {
      for (let i = 0; i < res[0].length; i++) {
        const element = res[0][i];

        if (element[0]) {
          traducao += element[0];
        }

      }
      return traducao;
    }
    return '';
  }

  salvarHtml(obj: any): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/kindle/leitor`, obj);
  }

  obterPronunciasObservable(palavras: any): Observable<any[]> {
    return this.http.post<any>(`${this.URL_BASE}/google`, palavras);
  }

  obterTraducoes(palavras: any): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/google/context-traducoes`, palavras);
  }

  salvarParametro(livro: any, campo: any, valor: any) {
    let dadosLivro = localStorage.getItem(livro.nome);
    let dados = JSON.parse(dadosLivro);
    if (!dados) {
      dados = {};
    }

    dados[campo] = valor;

    localStorage.setItem(livro.nome, JSON.stringify(dados));
  }

  obterParametro(livro: any, campo: any) {
    let dadosLivro = localStorage.getItem(livro.nome);
    let dados = JSON.parse(dadosLivro);
    if (!dados) {
      dados = {};
    }

    return dados[campo];
  }
}
