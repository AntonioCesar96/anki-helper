import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Cartao, RootObject } from '../_common/models/models';

@Injectable()
export class AdicionarPronunciaService {
  URL_BASE = 'http://localhost:3000';

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
}
