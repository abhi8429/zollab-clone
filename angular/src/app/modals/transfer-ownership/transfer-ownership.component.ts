import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.css']
})
export class TransferOwnershipComponent {
constructor(private activeModal:NgbActiveModal) {
}

  close(bool: boolean) {
    this.activeModal.close(bool);
  }
}
