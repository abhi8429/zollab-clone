import { Component } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {PaymentComponent} from "../payment/payment.component";
import {PaypalPaymentComponent} from "../paypal-payment/paypal-payment.component";

@Component({
  selector: 'app-bank-account-payment',
  templateUrl: './bank-account-payment.component.html',
  styleUrls: ['./bank-account-payment.component.css']
})
export class BankAccountPaymentComponent {
  constructor(private activeModal:NgbActiveModal,private dialog:NgbModal) {
  }
  close(team:Team |null){
    if(team){
      this.activeModal.close({team});
    }
    else {
      this.activeModal.close();
    }
  }
openPayment(){
    const modalRef=this.dialog.open(PaymentComponent);
}
paypalPayment(){
    const modalRef=this.dialog.open(PaypalPaymentComponent);
}

  }
