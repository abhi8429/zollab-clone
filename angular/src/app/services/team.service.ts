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

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient,
              private userService: UserService,
              private sessionStorageService: SessionStorageService) {

  }

  create(name: string): Observable<Team> {
    return this.http.post<Team>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/`,
      {teamName: name, userId: this.userId});
  }

  get(teamId: number):Observable<Team> {
    return this.http.get<Team>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}`)
  }

  getAll():Observable<Team[]> {
    return this.http.get<Team[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/`)
  }

  update(team: Team): Observable<Team> {
    return this.http.patch<Team>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/`
      + team.id,team);
  }

  updateImage(teamId: number, avatarImage: any) {
    return this.http.put<{fileName: string, ext: string, cdnUrl: string}>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/avatar`, avatarImage);
  }

  getById(teamId: number):Observable<Team> {
    return this.http.get<Team>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}`)
  }

  delete(teamId: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}`, {observe: "response"})
  }

  invite(teamId: number, member: {role: {roleName: string}; memberId: number | undefined}) {
    return this.http.put<any>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/members/`, member,{observe: "response"});
  }

  inviteBulk(teamId: number, members: [{role: {roleName: string}; memberId: number | undefined}]) {
    return this.http.put<TeamMember[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/members/bulk`, members,{observe: "response"});
  }

  removeMembers(teamId: number, memberIds: number[]) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/members/${memberIds}`, {observe: "response"})
  }

  getMembers(teamId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/members/`)
  }

  getMembersLike(teamId: number, searchParam: string) {
    return this.http.get<User[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/members/search/${searchParam}`);
  }

  setSelectedTeam(team: Team) {
    this.sessionStorageService.store('selectedTeam', team);
  }

  get selectedTeam(): Team {
    return  this.sessionStorageService.retrieve('selectedTeam');
  }

  get userId(): number {
    return this.userService.userId;
  }

  teamPermission(teamId: number){
    return this.http.get<User[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/my-permission`);
  }
}
