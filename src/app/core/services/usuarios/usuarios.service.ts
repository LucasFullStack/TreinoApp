import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuariosStorage } from './usuarios.storage';
import { concatMap, map } from 'rxjs/operators';
import { Result } from '../../models/helpers/result';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  constructor(private http: HttpClient,
              private usuariosStorage: UsuariosStorage) { }

  getUsuarioDisplay(forceRefresh = false): Observable<Result> {
 
    let key = this.usuariosStorage.getKeyDisplayName();

    if (!forceRefresh) {
      // Return the cached data from Storage
      return from(this.usuariosStorage.getLocalData(key));
    } else {
      return this.http.get<Result>(key).pipe(
        concatMap(res => this.usuariosStorage.setLocalData(key, res)),
        map(res => res)
      );
    }
  }

}
