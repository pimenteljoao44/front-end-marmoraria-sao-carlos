import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Grupo } from 'src/models/interfaces/grupo/Grupo';

@Injectable({
  providedIn: 'root',
})
export class GruposService {
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

  findAll(): Observable<Array<Grupo>> {
    return this.httpClient.get<Array<Grupo>>(
      `${this.baseUrl}/grupo`,
      this.httpOptions
    ).pipe(
      mergeMap(grupos =>
        forkJoin(
          grupos.map(grupo =>
            grupo.grupoPaiId
              ? this.httpClient.get<Grupo>(`${this.baseUrl}/grupo/${grupo.grupoPaiId}`, this.httpOptions)
                  .pipe(
                    map(grupoPai => ({ ...grupo, grupoPaiNome: grupoPai.nome }))
                  )
              : of(grupo)
          )
        )
      )
    );
  }


  findById(id: number): Observable<Grupo> {
    return this.httpClient.get<Grupo>(
      `${this.baseUrl}/grupo/${id}`,
      this.httpOptions
    );
  }

  create(grupo: Grupo): Observable<Grupo> {
    return this.httpClient.post<Grupo>(
      `${this.baseUrl}/grupo`,
      grupo,
      this.httpOptions
    );
  }

  update(grupo: Grupo): Observable<Grupo> {
    return this.httpClient.put<Grupo>(
      `${this.baseUrl}/grupo/${grupo?.id}`,
      grupo,
      this.httpOptions
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/grupo/${id}`,
      this.httpOptions
    );
  }
}
