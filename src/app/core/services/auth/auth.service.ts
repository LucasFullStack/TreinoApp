import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Register } from './../../models/auth/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL: string = environment.API_URL = "api/auth";

  constructor(private http: HttpClient) { }

  postRegister(register: Register): Observable<string> {

    return this.http.post<string>(this.API_URL + '/register', register).pipe(
      map((result: string) => {
        return result;
      }),
      catchError(err => {
        return throwError(err);
      })
    );

  }
}
