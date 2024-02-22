import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment, SERVICE_STELLA_CHAT, SERVICE_ZOLLAB} from "../../environments/environment";
import {Workspace} from "../model/workspace";
import {Observable} from "rxjs";
import {Member} from "../model/member";
import {Team} from "../model/team";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {UserService} from "./user.service";
import {TeamMember} from "../model/team-member";
import {Project} from "../model/project";
import {User} from "../model/user";
import {Chat, Content} from "../model/chat";
import {UserNotification} from "../model/user-notification";

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {

  constructor(private http: HttpClient,
              private userService: UserService) {

  }

  get userId(): number {
    return this.userService.userId;
  }

  getAll():Observable<[UserNotification]> {
    return this.http.get<[UserNotification]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/notifications/`)
  }

  getUnreadCount():Observable<[UserNotification]> {
    return this.http.get<[UserNotification]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/notifications/unread-count/`)
  }

  readAll():Observable<[UserNotification]> {
    return this.http.patch<[UserNotification]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/notifications/read-all/`, null)
  }

  update(notifications: any, notificationId: any):Observable<[UserNotification]> {
    return this.http.patch<[UserNotification]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/notifications/${notificationId}`, notifications)
  }
}
