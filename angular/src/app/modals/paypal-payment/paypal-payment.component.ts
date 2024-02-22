import { Component } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {PaymentComponent} from "../payment/payment.component";
import {BankAccountPaymentComponent} from "../bank-account-payment/bank-account-payment.component";

@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.css']
})
export class PaypalPaymentComponent {
constructor(private activeModal:NgbActiveModal,private dialog:NgbModal) {
}
close(team:Team | null){
  if(team){
    this.activeModal.close({team});
  }
  else {
    this.activeModal.close();
  }
}

openPayment() {
  const modalRef=this.dialog.open(PaymentComponent);
}
bankPayment(){
  const modalRef=this.dialog.open(BankAccountPaymentComponent);
}
}
