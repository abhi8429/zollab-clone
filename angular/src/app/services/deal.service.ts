import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment, SERVICE_STELLA_CHAT} from "../../environments/environment";
import {Attachment, Deal, DealList, FilterMeta} from "../model/deal";
import {Deliverable} from "../model/deliverable";

@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(private http: HttpClient) { }

  get(workspaceId: number, page: number, summary = '', tags = '', status = '', sort=""):Observable<DealList> {
    return this.http.get<DealList>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/?page=${page}&size=15&summary=${summary}&status=${status}&tags=${tags}&sort=${sort}`)
  }

  create(workspaceId: number, deal: any) {
    return this.http.post<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/`,deal);
  }

  uploadAttachment(workspaceId: number, dealId: number, fileContent: any) {
    return this.http.post<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/contents/`,
      fileContent, {reportProgress: true, observe: 'events'})
  }

  getAttachments(workspaceId: number, dealId: number) {
    return this.http.get<Attachment[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/contents/`)
  }

  getLinkedDeliverables(workspaceId: number, dealId: number):Observable<Deliverable[]> {
    return this.http.get<Deliverable[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/deliverables/`);
  }

  getAll(workspaceId: number): Observable<Deal[]>{
    return this.http.get<Deal[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/list/`);
  }

  update(workspaceId: number, dealId: number, deal: any) {
    return this.http.patch<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}`,deal);
  }

  getDealMeta(workspaceId: number) {
    return this.http.get<FilterMeta>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deal-meta/`);
  }

  getInvitedDeal(encodedInviteCode: string): Observable<Deal> {
    return this.http.get<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/public/deals/${encodedInviteCode}`);
  }

  updateStatus(workspaceId: number, dealId: number, status: string) {
    return this.http.patch<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/status/${status}`, {}, {observe: "response"});
  }

  uploadDocument(workspaceId: number, fileContent: any): Observable<HttpEvent<Deal>>{
    return this.http.post<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/`,
      fileContent, {reportProgress: true, observe: 'events'})
  }

  getById(workspaceId: number, id: number) {
    return this.http.get<Deal>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${id}`);
  }

  deleteAttachment(workspaceId: number, dealId: number, attachmentId: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/workspaces/${workspaceId}/deals/${dealId}/contents/${attachmentId}`)
  }
}
