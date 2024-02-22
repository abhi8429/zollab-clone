import { Component } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {PaymentDoneComponent} from "../payment-done/payment-done.component";
import {PaypalPaymentComponent} from "../paypal-payment/paypal-payment.component";
import {BankAccountPaymentComponent} from "../bank-account-payment/bank-account-payment.component";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  constructor(private activeModal:NgbActiveModal,private dialog:NgbModal) {
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }

  submitPayment()
  {
    const modalRef=this.dialog.open(PaymentDoneComponent);
  }

  paypalPayment(){
    const modalRef=this.dialog.open(PaypalPaymentComponent);
  }
  bankPayment(){
    const modalRef=this.dialog.open(BankAccountPaymentComponent);
  }

}
