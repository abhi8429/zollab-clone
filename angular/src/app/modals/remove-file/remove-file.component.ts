import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CreateProjectDeliverableService} from "../../services/create-project-deliverable.service";

@Component({
  selector: 'app-remove-file',
  templateUrl: './remove-file.component.html',
  styleUrls: ['./remove-file.component.css']
})
export class RemoveFileComponent {
  constructor(public activeModal: NgbActiveModal, private sharedService: CreateProjectDeliverableService) { }

  close(bool: boolean) {
    this.sharedService.setUserChoice('close');
    this.activeModal.close(bool);
  }

  delete(bool: boolean) {
    this.sharedService.setUserChoice('delete');
    this.activeModal.close(bool);
  }

}
