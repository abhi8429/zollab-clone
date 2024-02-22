import {Component} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {ImageChatModalComponent} from "../image-chat-modal/image-chat-modal.component";

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent {
  constructor(private activeModal: NgbActiveModal,private dialog:NgbModal) {
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }
  openImageChatModal(){
    const modalRef=this.dialog.open(ImageChatModalComponent);
  }
}
