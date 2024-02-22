import { Component } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {ShareFileComponent} from "../share-file/share-file.component";
import {ZipFileComponent} from "../zip-file/zip-file.component";

@Component({
  selector: 'app-image-chat-modal',
  templateUrl: './image-chat-modal.component.html',
  styleUrls: ['./image-chat-modal.component.css']
})
export class ImageChatModalComponent {
    constructor(private activeModal:NgbActiveModal,private dialog:NgbModal) {
    }

    close(team:Team|null){
      if(team){
        this.activeModal.close({team});
      }
      else {
        this.activeModal.close();
      }
    }
    openShareFile(){
      const modalRef=this.dialog.open(ShareFileComponent);
    }
openZipFile(){
      const modalRef=this.dialog.open(ZipFileComponent);
}
}
