import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "ngx-webstorage";
import {Deal} from "../model/deal";
import {environment, SERVICE_CONTENT} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  getAvatarURL() {
    return this.localStorageService.retrieve('avatarURL');
  }

  setAvatarURL():void {
    this.http.get(`${environment.baseUrl}/${SERVICE_CONTENT}/api/v1/public/cdn/base-url`, {observe: 'response', responseType: 'text'})
      .subscribe((response) => {
        //e.g https://closefriend-dev.sgp1.digitaloceanspaces.com/user-data/PUBLIC/491/PROFILE/dp.jpg
        this.localStorageService.store('avatarURL', response.body + 'user-data/PUBLIC');
      });
  }
}
