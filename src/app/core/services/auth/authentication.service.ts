import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Register } from './../../models/auth/register';
import { TokenStorageService } from './token-storage.service';
import { AccessData } from '../../models/auth/access-data';
import { Login } from '../../models/auth/login';
import { AuthService } from 'ngx-auth';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService implements AuthService {
	private API_URL: string = environment.API_URL + "api/auth";

	constructor(private http: HttpClient,
		private tokenStorage: TokenStorageService) { }


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

	refreshToken(): Observable<AccessData> {
		return this.tokenStorage.getRefreshToken()
			.pipe(
				switchMap((refreshToken: string) => {
					const _login: Login = new Login();
					_login.grant_Type = "refresh_token";
					_login.refreshToken = refreshToken;
					return this.postLogin(_login)
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

	getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}

	refreshShouldHappen(response: HttpErrorResponse): boolean {
		return response.status === 401;
	}

	verifyTokenRequest(url: string): boolean {
		return url.endsWith("refresh");
	}

	logout(refresh?: boolean): void {
		this.tokenStorage.clear();
		if (refresh) {
			location.reload(true);
		}
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

}
