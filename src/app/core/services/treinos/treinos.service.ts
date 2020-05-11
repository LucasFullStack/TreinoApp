import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { Result } from '../../models/helpers/result';
import { TreinosStorage } from './treinos.storage';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { TreinoNovo } from '../../models/treinos/treino-novo';

@Injectable({
  providedIn: 'root'
})
export class TreinosService {

  constructor(private treinosStorage: TreinosStorage,
    private http: HttpClient) { }

  getTreinosSemana(forceRefresh = false): Observable<Result> {

    let key = this.treinosStorage.getKeyTreinoSemana();

    if (!forceRefresh) {
      // Return the cached data from Storage
      return from(this.treinosStorage.getLocalData(key));
    } else {
      return this.http.get<Result>(key).pipe(
        concatMap(res => this.treinosStorage.setLocalData(key, res)),
        map(res => res)
      );
    }
  }


  getSemanaDias(forceRefresh = false): Observable<Result> {

    let key = this.treinosStorage.getKeySemanaDias();

    if (!forceRefresh) {
      // Return the cached data from Storage
      return from(this.treinosStorage.getLocalData(key));
    } else {
      return this.http.get<Result>(key).pipe(
        concatMap(res => this.treinosStorage.setLocalData(key, res)),
        map(res => res)
      );
    }
  }

  postTreinoNovo(treinoNovo: TreinoNovo): Observable<string> {
    const API_URL = this.treinosStorage.getAPI_URL();
    return this.http.post<string>(API_URL + '/Treino/Semana', treinoNovo).pipe(
      map((result: string) => {
        return result;
      }),
      catchError(err => {
        return throwError(err);
      })
    );

  }

}
