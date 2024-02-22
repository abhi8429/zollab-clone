import { Component } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubmitApprovalComponent} from "../submit-approval/submit-approval.component";

@Component({
  selector: 'app-guest-review-approval',
  templateUrl: './guest-review-approval.component.html',
  styleUrls: ['./guest-review-approval.component.css']
})
export class GuestReviewApprovalComponent {

constructor(private dialog:NgbModal,private activeModal: NgbActiveModal,) {
}

goBack(){

}
approve(){
    const modalReft=this.dialog.open(SubmitApprovalComponent,{ariaLabelledBy: 'modal-basic-title',backdrop: 'static', keyboard: false, centered: true,windowClass: 'custom-modal'});
}
}
