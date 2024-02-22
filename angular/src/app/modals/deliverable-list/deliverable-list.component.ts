import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Deliverable} from "../../model/deliverable";
import {UploadDeliverableComponent} from "../upload-deliverable/upload-deliverable.component";
import {ReviewApprovalComponent} from "../review-approval/review-approval.component";

@Component({
  selector: 'app-deliverable-list',
  templateUrl: './deliverable-list.component.html',
  styleUrls: ['./deliverable-list.component.css']
})
export class DeliverableListComponent {

  @Input()
  deliverables?: any[] = [];

  constructor(private dialog: NgbModal,
              private activeModal: NgbActiveModal) {

  }

  close(bool: boolean) {
    this.activeModal.close(bool);
  }

  openUploadDeliverable(deliverable: Deliverable) {
    const modalRef = this.dialog.open(UploadDeliverableComponent);
    modalRef.componentInstance.deliverable = deliverable;
    modalRef.result.then((result) => {
      if (!!result) {
        if(result.message === 'success') {
          deliverable.status = "IN_REVIEW";
        }
        if(result.message === 'failure') {
          deliverable.status = "NOT_STARTED";
        }
      }
      else{
        deliverable.status = "NOT_STARTED";
      }
    });
    this.activeModal.close();
  }

  openApproveDeliverable(deliverable: Deliverable) {
    const modalRef = this.dialog.open(ReviewApprovalComponent);
    modalRef.componentInstance.deliverable = deliverable;
    modalRef.result.then((result) => {
      if (!!result) {
        deliverable.status = 'APPROVED';
      }
    });
    this.activeModal.close();
  }
}
