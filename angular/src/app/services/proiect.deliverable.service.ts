import {Injectable} from '@angular/core';
import {environment, SERVICE_ZOLLAB} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {ProjectDeliverable} from "../model/project-deliverable";
import {ZollabContent} from "../model/zollab-content";

@Injectable({
  providedIn: 'root'
})
export class ProjectDeliverableService {

  constructor(private http: HttpClient, private userService: UserService) {
  }

  get userId(): number {
    return this.userService.userId;
  }

  createOrUpdate(teamId: number, projectId: number, deliverables: any[]) {
    return this.http.patch<[ProjectDeliverable]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/`, deliverables);
  }

  getAll(teamId: number, projectId: number) {
    return this.http.get<[ProjectDeliverable]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/`);
  }

  delete(teamId: number, projectId: number, deliverableIds: number[]) {
    return this.http.delete<void>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/deliverableIds`);
  }

  uploadAttachment(teamId: number, projectId: number, deliverableId: number, fileContent: any) {
    return this.http.post<ZollabContent>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/contents/`,
      fileContent, /*{reportProgress: true, observe: 'events'}*/)
  }

  get(teamId: number, projectId: number, deliverableId: number) {
    return this.http.get<[ProjectDeliverable]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/contents/`);
  }

  update(teamId: number, projectId: number, deliverableId: number) {
    return this.http.patch<[ProjectDeliverable]>(
      `${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/approved/`,
      null  // You can use null or omit this argument if no body is required
    );
  }

  patch(teamId: number, projectId: number, deliverableId: number, deliverables: any) {
    return this.http.patch<[ProjectDeliverable]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/`, deliverables);
  }

  patchDeliverable(teamId: number, projectId: number, deliverableId: number, deliverables: any) {
    return this.http.patch<[ProjectDeliverable]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/publish`, deliverables);
  }

  rejectApprove(teamId: number, projectId: number, deliverableId: number, deliverables: any) {
    return this.http.patch<[ProjectDeliverable]>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/reject`,null);
  }

  unapproved(teamId: any, projectId: any, deliverableId: any) {
    return this.http.patch<any>(
      `${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/projects/${projectId}/deliverables/${deliverableId}/unapprove`,
      null
    );
  }
}
