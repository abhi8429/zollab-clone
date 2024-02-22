import { Component, Input, OnInit } from '@angular/core';
import {Team} from "../../model/team";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AssetsComponent} from "../assets/assets.component";
import {FrequencyComponent} from "../frequency/frequency.component";
import { environment } from 'src/environments/environment';
import { ApiCallerService } from 'src/app/services/apiCallerService';
import { DeliverableService } from 'src/app/services/deliverable.service';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import {ProjectDeliverable} from "../../model/project-deliverable";
import {ProjectDeliverableService} from "../../services/proiect.deliverable.service";
import {SettingComponent} from "../setting/setting.component";
import {ProjectDetailsComponent} from "../project-details/project-details.component";

@Component({
  selector: 'app-instagram-reel',
  templateUrl: './instagram-reel.component.html',
  styleUrls: ['./instagram-reel.component.css']
})
export class InstagramReelComponent implements OnInit {
  deliverableSchedules: string[] = ['Once', 'Weekly', 'Monthly'];
  selectedFrequency: string | undefined;

  @Input()
  deliverable?: ProjectDeliverable;
  constructor(private activeModal:NgbActiveModal,private dialog:NgbModal, public apiCaller: ApiCallerService,
    private teamservice: TeamService, private projectService: ProjectService, private userService: UserService,
    private deliverableService: ProjectDeliverableService) {
  }
  ngOnInit(): void {
    console.log(this.deliverable);
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }
openAssets(){
const modalRef=this.dialog.open(AssetsComponent);
}
openFrequency(){
    const modalRef=this.dialog.open(FrequencyComponent);
}

  setFrequency(frequency: string): void {
    this.selectedFrequency = frequency;
    // @ts-ignore
    this.deliverable.schedule = frequency;
    this.deliverableService.patch(this.teamservice.selectedTeam.id!, this.projectService.selectedProject.id!, this.deliverable?.id!, this.deliverable).subscribe((deliverables) => {

    });
  }

  goBack(){
    this.activeModal.dismiss();
    const modalRef = this.openCalledPopup(ProjectDetailsComponent);
  }

  openCalledPopup(componentName:any): any{
    const modalRef =this.dialog.open(componentName,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true, windowClass: 'custom-modal'});
    return modalRef;
  }
}
