import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cartao, RootObject } from '../_common/models/models';

@Injectable()
export class LeitorService {

  URL_BASE = 'http://localhost:3000';

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

  salvarHtml(obj: any): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/kindle/leitor`, obj);
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
