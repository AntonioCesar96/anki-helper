import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Cartao, RootObject } from '../_common/models/models';

@Injectable()
export class Adicionar2Service {
  URL_BASE = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  criarCartao(cartao: Cartao): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/anki`, cartao);
  }

  salvarNotas(anki: any): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/anki/notas`, anki);
  }

  obterDefinicao(palavra: string): Observable<RootObject> {
    const headers = new HttpHeaders();
    return this.http.get<any>(`${this.URL_BASE}/dicionario?palavra=${palavra}`, { headers: headers })
  }

  obterDecks(): Observable<string[]> {
    const headers = new HttpHeaders();
    return this.http.get<any>(`${this.URL_BASE}/anki`, { headers: headers })
  }

  async obterTraducao(frase: any): Promise<any> {
    let headers = new HttpHeaders();
    // headers = headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36');
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=';

    var res = await firstValueFrom(this.http.get<any>(`${url}${frase}`, { headers: headers }));

    var traducao = '';
    if (res && res[0] && res[0][0]) {
      for (let i = 0; i < res[0].length; i++) {
        const element = res[0][i];

        if(element[0]) {
          traducao += element[0];
        }
        
      }
      return traducao;
    }
    return '';
  }


  async obterPronuncias(palavras: any): Promise<any[]> {

    var res = await firstValueFrom(this.http.post<any>(`${this.URL_BASE}/google`, palavras));

    return res;
  }
}