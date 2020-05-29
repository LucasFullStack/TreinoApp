import { Injectable } from '@angular/core';
import { Observable, from, throwError, forkJoin } from 'rxjs';
import { Result } from '../../models/helpers/result';
import { TreinosStorage } from './treinos.storage';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, catchError } from 'rxjs/operators';
import { TreinoSemanaAdd } from '../../models/treinos/treino-semana-add';
import { TreinoSemanaEdit } from '../../models/treinos/treino-semana-edit';
import { NetworkService, ConnectionStatus } from '../network/network.service';
import { OfflineManagerService } from '../offline-manager/offline-manager.service';
import { Treinos } from '../../models/treinos/treinos';

@Injectable({
  providedIn: 'root'
})
export class TreinosService {

  constructor(private treinosStorage: TreinosStorage,
    private http: HttpClient,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService) { }

  getTreinosSemana(forceRefresh = false): Observable<Result> {

    let key = this.treinosStorage.getKeyTreinoSemana();

    if (!forceRefresh) {
      // Return the cached data from Storage
      return from(this.treinosStorage.getLocalData(key));
    } else {
      return this.http.get<Result>(key).pipe(
        concatMap(res => this.treinosStorage.setLocalData(key, res)),
        map(res => res),
        catchError(err => {
          console.log(err)
          return throwError(err);
        })
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

  postTreinoSemana(treinoSemanaAdd: TreinoSemanaAdd): Observable<string> {
    const API_URL = this.treinosStorage.getAPI_URL();
    return this.http.post<string>(API_URL + '/Treino/Semana', treinoSemanaAdd).pipe(
      map((result: string) => {
        return result;
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  putTreinoSemana(treinoSemanaEdit: TreinoSemanaEdit, forceRefresh: boolean = false): Observable<any> {

    const API_URL = this.treinosStorage.getAPI_URL() + '/Treino/Semana';
    
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      return forkJoin([
        from(this.offlineManager.storeRequest(API_URL, 'PUT', treinoSemanaEdit))
      ])
    } else {
      return this.http.put(API_URL, treinoSemanaEdit).pipe(
        catchError(err => {
          return forkJoin([
            throwError(err),
            from(this.offlineManager.storeRequest(API_URL, 'PUT', treinoSemanaEdit))
          ])
        })
      );
    }
  }

  async updateTreinoSemana(treino: Treinos) {
    let _result: Result = await this.treinosStorage.getLocalTreinoSemana();
    _result.dados = [treino]
  }
}
