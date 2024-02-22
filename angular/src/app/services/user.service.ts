import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment, SERVICE_CONTENT, SERVICE_IDENTIY, SERVICE_STELLA_CHAT} from "../../environments/environment";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {Notification} from "../model/notification";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  signup(email: string | undefined): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/users/?signUpUsing=email`,{email: email});
  }

  signupWithEmailAndPwd(email: string | undefined, password: string | undefined): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/users/create?signUpUsing=email`,{email: email, password: password});
  }

  submitOtp(email: string, userId: number, otp: string) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/users/otp/verify`,{email: email,userId: userId, otp: otp}, {observe : 'response'});
  }

  updateProfile(user: any, id: number):Observable<User>  {
    return this.http.patch<User>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/users/` + id,user);
  }

  getUserProfile(id: number):Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/customers/` + id);
  }

  searchUser(phrase: string): Observable<User[]> {

    return this.http.get<User[]>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/users/search/` + phrase);
  }

  getNotification(userId: number):Observable<Notification> {
    return this.http.get<Notification>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/users/${userId}/notification`);
  }

  updateNotification(userId: number, notification: any) {
    return this.http.put<Notification>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/users/${userId}/notification`,notification);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/otp/send`,{email: email}, {observe : 'response'});
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/otp/verify`,{email: email, otp: otp}, {observe : 'response'});
  }

  changePassword(email: string, otp: string, newPassword: string ,confirmPassword: string) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/change`,{email: email, otp: otp, newPassword: newPassword, confirmPassword: confirmPassword}, {observe : 'response'});
  }

  uploadAvatar(userId: number, file: any) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_CONTENT}/api/v1/influencers/${userId}/avatar`,file, {observe: 'response', responseType: 'text'});
  }

  updatePassword(userId: number, newPassword: string ,oldPassword: string) {
    return this.http.patch(`${environment.baseUrl}/${SERVICE_IDENTIY}/api/v1/password/change/${userId}`,{newPassword: newPassword, oldPassword: oldPassword}, {observe : 'response'});
  }

  get userId(): number {
    const user = this.localStorageService.retrieve('user');
    return  user ? user.id: null;
  }

  getLocalUser(): User {
    return this.localStorageService.retrieve('user');
  }

  setLocalUser(user: User): void {
    this.localStorageService.store('user', user);
  }
}
