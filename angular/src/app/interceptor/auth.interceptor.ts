import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../auth/auth.service";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request || !request.url || (/^http/.test(request.url) && !(environment.baseUrl &&
      request.url.startsWith(environment.baseUrl)))) {
      return next.handle(request);
    }
    request = request.clone({
      setHeaders: {
          'base-url': environment.baseUrl
        }
    })
    const token = this.authService.getAccessToken();
    if (!!token && !request.url.includes('oauth/token')) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }
    return next.handle(request);
  }
}
