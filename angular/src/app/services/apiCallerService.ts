import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class ApiCallerService {
    constructor(private http: HttpClient){}
    getCall(url: any): Observable<any> {
        return this.http
          .get(url)
          .pipe(
            map((response: any) => response),
            catchError((error: any) => throwError(error))
          );
      }
  }