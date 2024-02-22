import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment, SERVICE_STELLA_CHAT} from "../../environments/environment";
import {Workspace} from "../model/workspace";
import {Observable} from "rxjs";
import {Member} from "../model/member";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private http: HttpClient) { }

  create(name: string, userId: number): Observable<Workspace> {
    return this.http.post<Workspace>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/`,
      {name: name, userId: userId, allowJoin:false});
  }

  /*invite(workspaceId: number, users: string[]) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/` + workspaceId + 'invite', {users})
  }*/

  get():Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/`)
  }

  update(workspace: Workspace): Observable<Workspace> {
    return this.http.patch<Workspace>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/`
      + workspace.id,workspace);
  }

  getMembers(workspaceId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/members/`)
  }

  getMembersByType(workspaceId: number, type: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/members/${type}`)
  }

  invite(workspaceId: number, member: {role: {roleName: string}; memberId: number | undefined}) {
    return this.http.put<any>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/members/`, member,{observe: "response"});
  }

  updateImage(workspaceId: number, workspaceImage: any) {
    return this.http.put<any>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/workspace-logo`, workspaceImage, {reportProgress: true, observe: 'events'});
  }

  getById(id: number):Observable<Workspace> {
    return this.http.get<Workspace>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${id}`)
  }

  removeMember(workspaceId: number, memberId: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/members/${memberId}`, {observe: "response"})
  }

  delete(id: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${id}`, {observe: "response"})
  }

  getInvitedWorkspace(encodedInviteCode: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/public/workspaces/${encodedInviteCode}`);
  }

}
