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
import {Project, ProjectEmailContract} from "../model/project";
import {User} from "../model/user";
import {Chat, Content} from "../model/chat";

@Injectable({
  providedIn: 'root'
})
export class ProjectEmailContractService {

  constructor(private http: HttpClient,
              private userService: UserService) {

  }

  getAll():Observable<[ProjectEmailContract]> {
    return this.http.get<[ProjectEmailContract]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/email-contracts/`)
  }

  get userId(): number {
    return this.userService.userId;
  }

  delete(emailContract: any):Observable<[ProjectEmailContract]> {
    return this.http.delete<[ProjectEmailContract]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/email-contracts/${emailContract}`)
  }
}
