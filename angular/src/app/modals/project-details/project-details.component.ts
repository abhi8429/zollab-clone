import { Component, OnInit } from '@angular/core';
import {Team} from "../../model/team";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {InstagramReelComponent} from "../instagram-reel/instagram-reel.component";
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';
import { ProjectDeliverableService } from 'src/app/services/proiect.deliverable.service';
import { DeliverableService } from 'src/app/services/deliverable.service';
import {UploadDeliverableComponent} from "../upload-deliverable/upload-deliverable.component";
import {SettingComponent} from "../setting/setting.component";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit{
  team?: Team;
  selectedProjectDetail:any='';

  constructor(private activeModal:NgbActiveModal,private dialog:NgbModal, private projectService: ProjectService,
              private teamService: TeamService, private deliverableService: DeliverableService) {
  }
  ngOnInit(): void {
    this.team = this.teamService.selectedTeam;
    this.selectedProjectDetail=this.projectService.selectedProject;
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }
openInstagramReel(deliverable:any){
  this.activeModal.dismiss();
  const modalRef = this.openCalledPopup(InstagramReelComponent);
    modalRef.componentInstance.deliverable = deliverable;
    this.deliverableService.deliverableId=deliverable.id;
    this.addEscapeKeyListener(modalRef);
}

goBack(){
  this.activeModal.dismiss();
  const modalRef = this.openCalledPopup(SettingComponent);
}
  openCalledPopup(componentName:any): any{
    const modalRef =this.dialog.open(componentName,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true, windowClass: 'custom-modal'});
    return modalRef;
  }

  addEscapeKeyListener(modalRef: any) {
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        modalRef.close();
      }
    };
    document.addEventListener('keydown', escapeListener);
    modalRef.result.finally(() => {
      document.removeEventListener('keydown', escapeListener);
    });
  }
}
