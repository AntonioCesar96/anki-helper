import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cartao, RootObject } from '../_common/models/models';

@Injectable()
export class AdicionarService {
  URL_BASE = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  criarCartao(cartao: Cartao): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}/anki`, cartao);
  }

  obterDefinicao(palavra: string): Observable<RootObject> {
    const headers = new HttpHeaders();
    return this.http.get<any>(`${this.URL_BASE}/dicionario?palavra=${palavra}`, { headers: headers })
  }

  obterDecks(): Observable<string[]> {
    const headers = new HttpHeaders();
    return this.http.get<any>(`${this.URL_BASE}/anki`, { headers: headers })
  }


}
