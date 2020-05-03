import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  /**
 * Get access token
 * @returns {Observable<string>}
 */
  getAccessToken(): Observable<string> {
    const token: string = <string>localStorage.getItem('accessToken');
    return of(token);
  }

  /**
  * Get refresh token
  * @returns {Observable<string>}
  */
  getRefreshToken(): Observable<string> {
    const token: string = <string>localStorage.getItem('refreshToken');
    return of(token);
  }

  /**
  * Set access token
  * @returns {TokenStorage}
  */
  setAccessToken(token: string): TokenStorageService {
    localStorage.setItem('accessToken', token);
    return this;
  }

  /**
  * Set refresh token
  * @returns {TokenStorage}
  */
  setRefreshToken(token: string): TokenStorageService {
    localStorage.setItem('refreshToken', token);
    return this;
  }
  setCreated(created: string): TokenStorageService {
    localStorage.setItem('created', created);
    return this;
  }

  setExpiration(expiration: string): TokenStorageService {
    localStorage.setItem('expiration', expiration);
    return this;
  }
  /**
  * Remove tokens
  */
  clear() {
    localStorage.clear();
  }
}
