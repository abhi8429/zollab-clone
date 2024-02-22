import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {map, Observable} from "rxjs";
import {environment, SERVICE_IDENTIY, TOKEN_AUTH_PASSWORD, TOKEN_AUTH_USERNAME} from "../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,
              private http: HttpClient,
              private localStorageService: LocalStorageService,
              public jwtHelper: JwtHelperService,
              private sessionStorageService: SessionStorageService) {
  }

  login(username: string, password: string): Observable<any> {
    const formData: any = new URLSearchParams();
    formData.set('username', (username));
    formData.set('password', (password));
    formData.set('grant_type', 'password');

    let headers = new HttpHeaders({
      'Authorization':'Basic ' + btoa(TOKEN_AUTH_USERNAME + ':' + TOKEN_AUTH_PASSWORD),
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${environment.baseUrl}/${SERVICE_IDENTIY}/oauth/token`,formData, {headers, observe: 'response'}).pipe(map((response: any) => {
      this.localStorageService.store('access_token', response.body.access_token);
      this.localStorageService.store('refresh_token', response.body.refresh_token);
      return response;
    }));
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.localStorageService.clear('access_token');
      this.localStorageService.clear('refresh_token');
      this.localStorageService.clear('user');
      this.sessionStorageService.clear("selectedWorkspace")
      observer.next();
    });
  }

  getAccessToken() {
    return this.localStorageService.retrieve('access_token');
  }

  get isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  saveAccessToken(token: string) {
    this.localStorageService.store('access_token', token);
  }

  getUser(): User {
    return this.localStorageService.retrieve('user');
  }

}
