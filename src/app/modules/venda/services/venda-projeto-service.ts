import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { VendaProjeto } from 'src/models/interfaces/venda/VendaProjeto';

@Injectable({
  providedIn: 'root'
})
export class VendaProjetoService {
  private baseUrl = `${environment.baseUrl}/venda-projeto`;
  private JWT_TOKEN: string;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {
    this.JWT_TOKEN = this.cookieService.get('USER_INFO');
  }

  private get httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.JWT_TOKEN}`
      })
    };
  }

  findAll(): Observable<VendaProjeto[]> {
    return this.httpClient.get<VendaProjeto[]>(this.baseUrl, this.httpOptions);
  }

  findById(id: number): Observable<VendaProjeto> {
    return this.httpClient.get<VendaProjeto>(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  create(vendaProjeto: VendaProjeto): Observable<VendaProjeto> {
    return this.httpClient.post<VendaProjeto>(this.baseUrl, vendaProjeto, this.httpOptions);
  }

  update(id: number, vendaProjeto: VendaProjeto): Observable<VendaProjeto> {
    return this.httpClient.put<VendaProjeto>(`${this.baseUrl}/${id}`, vendaProjeto, this.httpOptions);
  }

  efetuarVenda(id: number): Observable<VendaProjeto> {
    return this.httpClient.patch<VendaProjeto>(`${this.baseUrl}/${id}/efetuar`, {}, this.httpOptions);
  }

  findByCliente(clienteId: number): Observable<VendaProjeto[]> {
    return this.httpClient.get<VendaProjeto[]>(`${this.baseUrl}/cliente/${clienteId}`, this.httpOptions);
  }

  gerarOrdemServico(id: number): Observable<string> {
    return this.httpClient.post<string>(`${this.baseUrl}/${id}/gerar-os`, {}, this.httpOptions);
  }

  gerarContaReceber(id: number): Observable<string> {
    return this.httpClient.post<string>(`${this.baseUrl}/${id}/gerar-conta-receber`, {}, this.httpOptions);
  }
}

