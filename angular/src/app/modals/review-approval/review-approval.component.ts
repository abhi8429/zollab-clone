import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {Team} from "../../model/team";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectDeliverable} from "../../model/project-deliverable";
import {TeamService} from "../../services/team.service";
import {ContentService} from "../../services/content.service";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {ProjectDeliverableService} from "../../services/proiect.deliverable.service";

@Component({
  selector: 'app-review-approval',
  templateUrl: './review-approval.component.html',
  styleUrls: ['./review-approval.component.css']
})
export class ReviewApprovalComponent {

  @Input()
  deliverable?: ProjectDeliverable;
  deliverables: any;
  lastDeliverable: any = {};
  constructor(private activeModal:NgbActiveModal,
              public teamService: TeamService,
              public projectService: ProjectService,
              private deliverableService: ProjectDeliverableService) {
  }

  ngOnInit(){
    this.deliverableService.get(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, this.deliverable?.id!)
      .subscribe((deliverables: any) => {
        this.deliverables = deliverables;
        if (this.deliverables && this.deliverables.length > 0) {
          if (this.deliverables.length === 1) {
            this.lastDeliverable = this.deliverables[0];
          } else {
            this.lastDeliverable = this.deliverables[this.deliverables.length - 1];
          }
        } else {
          console.log("No deliverables found.");
        }
      })
    console.log(this.deliverable);
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }

  save(){
    this.deliverableService.update(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, this.deliverable?.id!)
      .subscribe(() => {

      })
    this.activeModal.close({message: this.deliverable});
  }

  closed() {
    this.activeModal.close();
  }

  callToRejectReview(){
    this.deliverableService.rejectApprove(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, this.deliverable?.id!,this.deliverable)
    .subscribe(() => {

    })
  this.activeModal.close({message: this.deliverable});
  }
}
