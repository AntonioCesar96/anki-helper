import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Cartao, RootObject } from '../_common/models/models';

@Injectable()
export class CifraService {
  // URL_BASE = 'http://localhost:3000';
  URL_BASE = 'http://192.168.1.134:3000';

  constructor(
    private http: HttpClient
  ) { }

  criarCartao(cartao: Cartao): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/anki`, cartao);
  }

  async salvarNotas(anki: any): Promise<any> {
    const headers = new HttpHeaders();
    var res = await firstValueFrom(this.http.post<any>(`${this.URL_BASE}/anki/notas`, anki));

    return res;
  }

  obterDecks(): Observable<string[]> {
    const headers = new HttpHeaders();
    return this.http.get<any>(`${this.URL_BASE}/anki`, { headers: headers })
  }

  async obterPronuncias(palavras: any): Promise<any[]> {

    var res = await firstValueFrom(this.http.post<any>(`${this.URL_BASE}/google`, palavras));

    return res;
  }

  obterPronunciasObservable(palavras: any): Observable<any[]> {
    return this.http.post<any>(`${this.URL_BASE}/google`, palavras);
  }

  obterCifras(): Observable<any> {
    const opts: any = {
      headers: new HttpHeaders({})
    };

    return this.http.get<any>(`${this.URL_BASE}/index.json`, opts);
  }

  obterCifras64(): Observable<any> {
    const opts: any = {
      headers: new HttpHeaders({})
    };

    return this.http.get<any>(`${this.URL_BASE}/cifrasBase64.json`, opts);
  }

  obterCifra(id: string): Observable<any> {
    const opts: any = {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: 'text'
    };

    return this.http.get<any>(`${this.URL_BASE}/${id}`, opts);
  }

  salvarIndexJson(json: any): Observable<any> {
    const opts: any = {
      headers: new HttpHeaders({})
    };

    console.log(JSON.stringify(json))

    return this.http.post<any>(`${this.URL_BASE}/cifra/salvar`, json, opts);
  }

  // obterCifra(id: string): Observable<any> {
  //   const headers = new HttpHeaders();
  //   const opts: any = {
  //     headers: new HttpHeaders({
  //       'Accept': 'text/html, application/xhtml+xml, */*',
  //       'Content-Type': 'text/plain; charset=utf-8'
  //     }),
  //     responseType: 'text'
  //   };

  //   return this.http.get<any>(`https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=view&id=${id}`, opts);
  // }
}
