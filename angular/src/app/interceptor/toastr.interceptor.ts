import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import {catchError, tap} from "rxjs/operators";
import {ErrorHandlerService} from "../services/error.handler.service";
import {NgProgressInterceptor} from "ngx-progressbar/http";

@Injectable()
export class ToastrInterceptor implements HttpInterceptor {

  constructor(private toastrService: ToastrService, private errorhandler: ErrorHandlerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('ERROR : ', error);
        this.errorhandler.handleError(error);
        return throwError(() => error);
      }),
      tap(evt => {
        if (evt instanceof HttpResponse) {
          let regex = /users\/[0-9]+\/teams\/[0-9]+\/projects\/[0-9]+\/messages\/$/i;
          if(!(req.url.includes("identity/oauth/token") || regex.test(req.url)) && (req.method.toUpperCase() === 'PUT' || req.method.toUpperCase() === 'POST' ||
            req.method.toUpperCase() === 'DELETE' || req.method.toUpperCase() === 'PATCH'))
            this.toastrService.success('Request Completed successfully', 'Success', {onActivateTick: true});
        }})
    );
  }
}
