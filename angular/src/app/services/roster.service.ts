import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment, SERVICE_STELLA_CHAT} from "../../environments/environment";
import {PublicRoster, Roster} from "../model/roster";
import {Profile} from "../model/roster-profile";
import {ProfileList} from "../model/profile-list";

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  constructor(private http: HttpClient) {
  }

  createRoster(name: string): Observable<Roster> {
    return this.http.post<Roster>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/`,
      {name: name});
  }

  getRosters(): Observable<Roster[]> {
    return this.http.get<Roster[]>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/`)
  }

  search(keyword: string) {
    return this.http.get<Profile>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/search?keyword=${keyword}`)
  }

  getRosterProfile(id: number) {
    return this.http.get<ProfileList>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/${id}/profiles/`)
  }

  addProfileToRoster(rosterIds: number[],profileId: number): Observable<Roster> {
    return this.http.post<Roster>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters-profiles/${profileId}/rosters/`,
      rosterIds);
  }

  getPublicRosterDetails(inviteCode: string) {
    return this.http.get<PublicRoster>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/public/rosters/${inviteCode}`)
  }

  invite(rosterId: number, invitedEmails: string) {
    return this.http.post<Roster>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/${rosterId}/invite/`,
      [invitedEmails], {observe: "response"});
  }

  removeProfileFromRoster(rosterId: number,profileId: number) {
    return this.http.delete(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/${rosterId}/profiles/${profileId}`, {observe:"response"});
  }

  addNotes(rosterId: number, profileId: number, notes: string) {
    return this.http.put<Roster>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/${rosterId}/profiles/${profileId}/notes`,
      {notes}, {observe: "response"});
  }

  uploadRosterImage(rosterId: number, rosterImage: FormData) {
    return this.http.put<any>(`${environment.baseUrl}/${SERVICE_STELLA_CHAT}/api/v1/rosters/${rosterId}/roster-logo`, rosterImage, {reportProgress: true, observe: 'events'});
  }
}
