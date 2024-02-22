import {Injectable} from '@angular/core';
import {environment, SERVICE_STELLA_CHAT, SERVICE_ZOLLAB} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Deliverable, DeliverableList, DraftPost, FilterMeta} from "../model/deliverable";
import {Observable} from "rxjs";
import {Evidence} from "../model/evidence";
import {LivePost} from "../model/live-post";
import {Report} from "../model/report";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class DeliverableService {

  constructor(private http: HttpClient, private userService: UserService) { }

  get userId(): number {
    return this.userService.userId;
  }

  create(workspaceId: number, dealId: number, deliverable: any) {
    return this.http.post<Deliverable>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${workspaceId}/deals/${dealId}/deliverables/`, deliverable);
  }

  createOrUpdate(teamId: number, projectId: number, deliverable: any[]) {
    return this.http.patch<Deliverable>(`${environment.baseUrl}/${SERVICE_ZOLLAB}/api/v1/users/${this.userId}/teams/${teamId}/deliverables/`, deliverable);
  }

  getWorkspaceDeliverables(workspaceId: number, page: number, summary = '', due = '', status = '', creator=''): Observable<DeliverableList> {
    return this.http.get<DeliverableList>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deliverables/?page=${page}&size=15&summary=${summary}&status=${status}&dueOn=${due}&creator=${creator}`);
  }

  uploadEvidence(workspaceId: number, dealId: string, deliverableId: number, file: any) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/evidences/`, file);
  }

  downloadEvidences(workspaceId: number, dealId: number, deliverableId: number):Observable<Evidence[]> {
    return this.http.get<Evidence[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/evidences/`);
  }

  updateStatus(workspaceId: number, dealId: number, deliverableId: number, status: string, changesRequested: { changedRequestedReason: string | undefined }):Observable<Deliverable> {
    return this.http.patch<Deliverable>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/${status}/`, changesRequested);
  }

  getById(workspaceId: number, dealId: number, deliverableId: number):Observable<Deliverable> {
    return this.http.get<Deliverable>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/`);
  }

  getDeliverableMeta(workspaceId: number) {
    return this.http.get<FilterMeta>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deliverable-meta/`);
  }

  update(workspaceId: number, dealId: number, deliverableId: number, deliverable: any) {
    return this.http.patch<Deliverable>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}`, deliverable);
  }

  getInvitedDeliverable(encodedInviteCode: string): Observable<Deliverable> {
    return this.http.get<Deliverable>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/public/deliverables/${encodedInviteCode}`);
  }
  delete(workspaceId: number, dealId: number, deliverableId: number) {
    return this.http.delete<Deliverable>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}`, {observe: "response"});
  }

  addLivePost(workspaceId: number, dealId: number, deliverableId: number, formData: any) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/live-posts/`, formData);
  }

  getLivePosts(workspaceId: number, dealId: number, deliverableId: number): Observable<LivePost[]> {
    return this.http.get<LivePost[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/live-posts/`);
  }

  deleteLivePost(workspaceId: number, dealId: number, deliverableId: number, postId: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/live-posts/${postId}`);
  }

  generateReport(workspaceId: number, dealId: number, deliverableId: number) {
    return this.http.get<Report>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/report/`);
    // return this.http.get<Report>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/30/deals/37/deliverables/91/report/`);
  }

  downloadReport(workspaceId: number, dealId: number, deliverableId: number): Observable<any> {
    // return this.http.get<Report>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/report/`);
    return this.http.get(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/report/download/`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/octet-stream',
      }),
      responseType: 'blob',
      observe: 'response',
    });
  }

  addDraftPost(workspaceId: number, dealId: number, deliverableId: number, formData: any) {
    return this.http.post(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/drafts/`, formData);
  }

  getDraftPosts(workspaceId: number, dealId: number, deliverableId: number): Observable<DraftPost[]> {
    return this.http.get<DraftPost[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/drafts/`);
  }

  deleteDraftPost(workspaceId: number, dealId: number, deliverableId: number, postId: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/${deliverableId}/drafts/${postId}`);
  }

  resolveCorsProxy(url: string) {
    return `${environment.baseUrl}/internal-proxy/api/v1/external-content/image?url=${url}`;
  }
  deliverableId:any;
  getDeliverableId(){
    return this.deliverableId;
  }
}
