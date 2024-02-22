import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment, SERVICE_ZOLLAB} from "../../environments/environment";
// import {Attachment, Deal, DealList, FilterMeta} from "../model/deal";
import {UserService} from "./user.service";
import {Project} from "../model/project";
import {ProjectMember} from "../model/project-member";
import {SessionStorageService} from "ngx-webstorage";
import {ZollabContent} from "../model/zollab-content";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private userService: UserService,
              private sessionStorageService: SessionStorageService) {
  }

  /* get(workspaceId: number, page: number, summary = '', tags = '', status = '', sort = ""): Observable<DealList> {
     return this.http.get<DealList>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/?page=${page}&size=15&summary=${summary}&status=${status}&tags=${tags}&sort=${sort}`)
   }*/

  create(teamId: number, project: any) {
    return this.http.post<Project>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/`, project);
  }

  createWithEmailContract(teamId: number, emailContractId: number) {
    return this.http.post<Project>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/email-contract?emailContractId=${emailContractId}`, {})
  }

  createWithChatGpt(teamId: number, fileContent: any) {
    return this.http.post<Project>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/extract`, fileContent)
  }

  getAll(teamId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/`);
  }

  getMembers(teamId: number, projectId: any): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/members/`)
  }

  inviteBulk(teamId: number, projectId: number, members: [{ role: { roleName: string }, memberId: number | undefined }]) {
    return this.http.put<ProjectMember[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/members/bulk`, members, {observe: "response"});
  }

  removeMembers(teamId: number, projectId: number, memberIds: number[]) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/members/${memberIds}`, {observe: "response"})
  }

  uploadAttachment(teamId: number, projectId: number, fileContent: any) {
    return this.http.post<ZollabContent>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/contents/`,
      fileContent, /*{reportProgress: true, observe: 'events'}*/)
  }

  getAttachments(teamId: number, projectId: number) {
    return this.http.get<ZollabContent[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/contents/`)
  }

  setSelectedProject(project: Project) {
    this.sessionStorageService.store('selectedProject', project);
  }

  get selectedProject(): Project {
    return this.sessionStorageService.retrieve('selectedProject');
  }

  get userId(): number {
    return this.userService.userId;
  }

  getProjectById(teamId: number, projectId: any) : Observable<Project> {
    return this.http.get<Project>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}`);
  }

  projectStatus(teamId: number, periodStatus: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/?periodStatus=${periodStatus}`);
  }

  deliverableStatus(teamId: number, deliverableStatus: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/?deliverableStatus=${deliverableStatus}`);
  }

  projectAndDeliverableStatus(teamId: number, periodStatus: string, deliverableStatus: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/?periodStatus=${periodStatus}&deliverableStatus=${deliverableStatus}`);
  }

  projectPermission(teamId: number, projectId: number){
    return this.http.get<Project[]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/my-permission`);
  }
}
