import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { TeamService } from 'src/app/services/team.service';
import { ContentService } from 'src/app/services/content.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user';
import {ProjectDetailsComponent} from "../project-details/project-details.component";
import {SettingComponent} from "../setting/setting.component";

@Component({
  selector: 'app-starred-messages',
  templateUrl: './starred-messages.component.html',
  styleUrls: ['./starred-messages.component.css']
})
export class StarredMessagesComponent implements OnInit{
  @Input() receivedData:any= [];
  readonly AVATAR_BASE_URL;
  startMessage:any=[];
  user = {} as User;
  imageFile: File | undefined;
  imageFileName: string = '';
  imageUrl: any = null;
  noItemsFound: boolean = false;

  constructor(private activeModal: NgbActiveModal,private router: Router,private route: ActivatedRoute,
              public teamService: TeamService, private userService: UserService,
              contentService: ContentService,private dialog:NgbModal) {
                this.user = userService.getLocalUser();
                this.AVATAR_BASE_URL = contentService.getAvatarURL();
                this.imageUrl = `${this.AVATAR_BASE_URL}/${this.user.id}/PROFILE/dp_50X50.jpg?ver=` + Math.random();
  }
  redirectFor:any= 'starMsg';
  msgTitle:any=''
  ngOnInit(): void {
    this.startMessage=this.receivedData.key;
    this.redirectFor =this.receivedData.redirectFor;
    if(this.redirectFor=='starMsg'){
      this.msgTitle='Starred Messages';
    }
    else{
      this.msgTitle=''
    }
    console.log("receivedData---"+this.receivedData.key)
    this.noItemsFound = !this.startMessage || this.startMessage.length === 0;
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }

  navigateToMessageChatDashBoard(item:any){
    this.close(null);
    this.router.navigateByUrl('/chat-dashboard?messageId='+item.key.id)
  }
  getFormatedDate(date: string) {
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
  }

  getFormattedTime(date: string) {
    const currentDate = new Date();
    const inputDate = new Date(date);
    const timezoneOffset = currentDate.getTimezoneOffset();
    inputDate.setMinutes(inputDate.getMinutes() - timezoneOffset);
    const providedDate = new Date(inputDate);
    const timeDifference: number = currentDate.getTime() - providedDate.getTime() + 3000;
    const secondsDifference: number = Math.floor(timeDifference / 1000);
    if (secondsDifference < 60) {
      return `${secondsDifference} second${secondsDifference !== 1 ? 's' : ''}`;
    }
    const minutesDifference: number = Math.floor(secondsDifference / 60);
    if (minutesDifference < 60) {
      return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''}`;
    }
    const hoursDifference: number = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''}`;
    }
    const daysDifference: number = Math.floor(hoursDifference / 24);
    return `${daysDifference} day${daysDifference !== 1 ? 's' : ''}`;
  }

  goBack(){
    this.activeModal.dismiss();
    const modalRef = this.openCalledPopup(SettingComponent);
  }

  openCalledPopup(componentName:any): any{
    const modalRef =this.dialog.open(componentName,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true, windowClass: 'custom-modal'});
    return modalRef;
  }
}
