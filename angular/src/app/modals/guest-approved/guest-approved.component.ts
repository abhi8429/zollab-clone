import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-guest-approved',
  templateUrl: './guest-approved.component.html',
  styleUrls: ['./guest-approved.component.css']
})
export class GuestApprovedComponent {
  constructor(public  activeModal:NgbActiveModal) {
  }

  close(bool: boolean) {
    this.activeModal.close(bool);
  }
}
