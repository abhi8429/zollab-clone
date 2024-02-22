import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {result} from "lodash-es";

@Component({
  selector: 'app-payment-done',
  templateUrl: './payment-done.component.html',
  styleUrls: ['./payment-done.component.css']
})
export class PaymentDoneComponent {
  constructor(private activeModal:NgbActiveModal) {
  }
  close(team:Team | null){

    if(team){
      this.activeModal.close({team});
    }
    else {
      this.activeModal.close();
    }
  }

}
