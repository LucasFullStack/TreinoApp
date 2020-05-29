import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { Register } from './../../models/auth/register';
import { TokenStorageService } from './token-storage.service';
import { AccessData } from '../../models/auth/access-data';
import { Login } from '../../models/auth/login';
import { AuthService } from 'ngx-auth';
import { AlertService } from '../alert/alert.service';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService implements AuthService {
	private API_URL: string = environment.API_URL + "api/auth";

	constructor(private http: HttpClient,
		private tokenStorage: TokenStorageService,
		private alertService: AlertService) { }


	/**
	 * Submit login request
	 * @param {Credential} credential
	 * @returns {Observable<any>}
	 */
	postLogin(login: Login): Observable<any> {
		return this.http.post<any>(this.API_URL + "/login", login).pipe(
			map((result: any) => {
				if (result instanceof Array) {
					return result.pop();
				}
				return result;
			}),
			tap(this.saveAccessData.bind(this)),
			catchError(err => {
				return throwError(err);
			})
		);
	}

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

	/**
 * Function, that should perform refresh token verifyTokenRequest
 * @description Should be successfully completed so interceptor
 * can execute pending requests or retry original one
 * @returns {Observable<any>}
 */

	refreshToken(): Observable<AccessData> {
		return this.tokenStorage.getRefreshToken()
			.pipe(
				switchMap((refreshToken: string) => {
					const _login: Login = new Login();
					_login.grant_Type = "refresh_token";
					_login.refreshToken = refreshToken;
					return this.http.post<any>(this.API_URL + "/login", _login)
				}),
				map((result: any) => {
					console.log(result)
					if (result instanceof Array) {
						return result.pop();
					}
					return result;
				}),
				tap(this.saveAccessData.bind(this)),
				catchError(err => {
					this.logout(true);
					return throwError(err);
				})
			);
	}

	isAuthorized(): Observable<boolean> {
		return this.tokenStorage.getAccessToken().pipe(map(token => !!token));
	}

	/**
 * Get access token
 * @description Should return access token in Observable from e.g. localStorage
 * @returns {Observable<string>}
 */
	getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}


	/**
	 * Function, checks response of failed request to determine,
	 * whether token be refreshed or not.
	 * @description Essentialy checks status
	 * @param {Response} response
	 * @returns {boolean}
	 */
	refreshShouldHappen(response: HttpErrorResponse): boolean {
		return response.status === 401;
	}

	verifyTokenRequest(url: string): boolean {
		return url.endsWith("refresh");
	}

	logout(refresh?: boolean): void {
		this.tokenStorage.clear();
		if (refresh) {
			this.alertService.presentAlert('Sessão expirada', 'Faça o login novamente!')
				.then(() => {
				  location.reload(true);
				})
			return;
		}
		location.reload(true);
	}

	private saveAccessData(accessData: AccessData) {
		if (typeof accessData !== 'undefined') {
			this.tokenStorage
				.setAccessToken(accessData.accessToken)
				.setCreated(accessData.created)
				.setExpiration(accessData.expiration)
				.setRefreshToken(accessData.refreshToken)
		}
	}


	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return from(result);

		};
	}

}
