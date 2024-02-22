import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-changes-needed',
  templateUrl: './changes-needed.component.html',
  styleUrls: ['./changes-needed.component.css']
})
export class ChangesNeededComponent {

  suggestedChanges: string | undefined;

  constructor(public activeModal: NgbActiveModal) {
  }

  save() {
    this.activeModal.close({suggestedChanges: this.suggestedChanges})
  }

}
