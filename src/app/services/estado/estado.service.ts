import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from 'src/models/interfaces/estado/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  baseUrl = environment.baseUrl;
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
        Authorization: `Bearer ${this.JWT_TOKEN}`,
      }),
    };
  }

  findAll(): Observable<Array<Estado>> {
    return this.httpClient.get<Array<Estado>>(
      `${this.baseUrl}/localidades/estados`,
      this.httpOptions
    );
  }

  findById(id: any): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/api/estado/${id}`, this.httpOptions);
}

create(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(`${this.baseUrl}/api/estado`, estado, this.httpOptions);
}

update(estado: Estado): Observable<Estado> {
  return this.httpClient.put<Estado>(
    `${this.baseUrl}/api/estado/${estado?.id}`,
    estado,
    this.httpOptions
  );
}

  delete(id:any):Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/api/estado/${id}`,
      this.httpOptions
    );
  }
}
