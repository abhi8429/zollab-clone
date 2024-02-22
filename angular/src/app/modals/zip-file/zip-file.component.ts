import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";

@Component({
  selector: 'app-zip-file',
  templateUrl: './zip-file.component.html',
  styleUrls: ['./zip-file.component.css']
})
export class ZipFileComponent {
constructor(private activeModal:NgbActiveModal) {

}
close(team:Team|null){
  if(team){
    this.activeModal.close({team});
  }
  else {
    this.activeModal.close();
  }
}
}
