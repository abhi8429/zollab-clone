import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";

@Component({
  selector: 'app-share-file',
  templateUrl: './share-file.component.html',
  styleUrls: ['./share-file.component.css']
})
export class ShareFileComponent {
  constructor(private activeModal:NgbActiveModal) {
  }
  close(team:Team |null){
    if(team){
      this.activeModal.close({team});
    }
    else {
      this.activeModal.close();
    }
  }

}
