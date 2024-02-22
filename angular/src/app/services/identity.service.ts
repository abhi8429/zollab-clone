import { Injectable } from '@angular/core';
import {environment, SERVICE_IDENTIY, SERVICE_ZOLLAB} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ZollabContent} from "../model/zollab-content";

interface identity {
  token: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private http: HttpClient) { }

  sendOtp(email: any) {
    return this.http.post<identity>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/otp/send`, email);
  }

  verify(email: any) {
    return this.http.post<identity>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/otp/verify`, email);
  }

  changePassword(email: any) {
    return this.http.post<identity>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/change`, email);
  }
}
