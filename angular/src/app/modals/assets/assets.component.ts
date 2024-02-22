import { Component, OnInit } from '@angular/core';
import { Team } from "../../model/team";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageModalComponent } from "../image-modal/image-modal.component";
import { ApiCallerService } from 'src/app/services/apiCallerService';
import { environment } from 'src/environments/environment';
import { TeamService } from 'src/app/services/team.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { DeliverableService } from 'src/app/services/deliverable.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal, private dialog: NgbModal, public apiCaller: ApiCallerService,
    private teamservice: TeamService, private projectService: ProjectService, private userService: UserService,
    private deliverableService: DeliverableService) {
  }
  ngOnInit(): void {
    this.getAssets();
  }
  close(team: Team | null) {
    if (team) {
      this.activeModal.close({ team })
    }
    else {
      this.activeModal.close();
    }
  }
  openImageModal(imageUrl: any) {
    const modalRef = this.dialog.open(ImageModalComponent);
    modalRef.componentInstance.receivedData = { key: imageUrl };
  }
  assetsData: any = [];
  fileList: any = [];
  urlList: any = []
  captionList: any = [];
  getAssets() {
    this.assetsData = [];
    this.fileList = [];
    this.urlList = []
    this.captionList = []
    let url = environment.baseUrl + "/zollab/api/v1/users/" + this.userService.userId + "/teams/" + this.teamservice.selectedTeam.id + "/projects/" + this.projectService.selectedProject.id + "/deliverables/" + this.deliverableService.getDeliverableId() + "/contents/?status=" + (this.clikedButtonState == '' ? '' : this.clikedButtonState);

    this.apiCaller.getCall(url).subscribe(
      data => {

        this.assetsData = data;
        this.assetsData.forEach((element: any) => {
          if (element.type == 'IMAGE') {
            this.fileList.push(element);
          }
          if (element.type == 'URL') {
            this.urlList.push(element)
          }
          if (element.caption) {
            this.captionList.push(element)
          }
        });
      }
    )
  }

  activeButton: string | null = 'inProgress';
  clikedButtonState: any = '';
  toggleButton(buttonId: string): void {
    if (buttonId == 'inProgress') {
      this.clikedButtonState = 'IN_PROGRESS'
    }
    if (buttonId == 'done') {
      this.clikedButtonState = 'DONE'
    }
    if (buttonId == 'published') {
      this.clikedButtonState = 'PUBLISHED'
    }
    if (buttonId == 'notstarted') {
      this.clikedButtonState = 'NOT_STARTED'
    }
    if (buttonId !== this.activeButton) {
      this.activeButton = buttonId;
    } else {
      this.activeButton = null;
    }
    this.getAssets();
  }
}
