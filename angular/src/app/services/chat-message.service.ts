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

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  public uploadFileType:any; //video/images or Pdf file
  constructor(private http: HttpClient,
              private userService: UserService,
              private sessionStorageService: SessionStorageService) {

  }

  create(teamId: number, projectId: number, chatContent: Content): Observable<Content> {
    return this.http.post<Content>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/`,
      chatContent);
  }


  getAll(teamId: number, projectId: number):Observable<Chat> {
    return this.http.get<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/?limit=10`)
  }

  getUp(teamId: number, projectId: number, piotId: string):Observable<Chat> {
    return this.http.get<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/?limit=10&fetchOrder=U&piotId=${piotId}`)
  }

  delete(teamId: number, projectId: number, piotId: string):Observable<Chat> {
    return this.http.delete<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/?limit=10&fetchOrder=U&piotId=${piotId}`)
  }

  getDown(teamId: number, projectId: number, piotId: string):Observable<Chat> {
    return this.http.get<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/?limit=10&fetchOrder=D&piotId=${piotId}`)
  }

  getUpDown(teamId: number, projectId: number, piotId: string):Observable<Chat> {
    return this.http.get<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/?limit=20&fetchOrder=UD&piotId=${piotId}`)
  }

  get userId(): number {
    return this.userService.userId;
  }

  deleteMessages(teamId: any, projectId: any, id: any) {
    return this.http.delete<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/${id}`);
  }

  starMessages(teamId: any, projectId: any, id: any, chatContent: Content) {
    if(chatContent.star === false){
      chatContent.star = null;
    }
    return this.http.patch<Content>(
      `${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/messages/${id}`,
      chatContent
    );
  }

  messageSearch(userId:any,teamId:any,projectId:any,searchKey:any):Observable<Chat> {
    return this.http.get<Chat>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${userId}/teams/${teamId}/projects/${projectId}/messages/?searchKey=${searchKey}`)
  }

  getMessageById(userId:any,teamId:any,projectId:any,messageId:any):Observable<Content>{
    // /zollab/api/v1/users/1/teams/1/projects/1/messages/45d131f0-c8a9-11ee-96d8-6f77e1600dae
    return this.http.get<Content>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${userId}/teams/${teamId}/projects/${projectId}/messages/${messageId}`)
  }
}
