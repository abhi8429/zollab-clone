import { Component, OnInit } from '@angular/core';
import {ContentService} from "../../services/content.service";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private contentService: ContentService, private router: Router, private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService) {
    contentService.setAvatarURL();
  }
  ngOnInit(): void {
    if(this.localStorageService.retrieve('access_token')){
      this.router.navigate(['project-dashboard']);
    }
  }
  scroll(id:string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
}
