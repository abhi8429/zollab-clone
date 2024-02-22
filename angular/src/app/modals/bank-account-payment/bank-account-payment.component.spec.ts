import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountPaymentComponent } from './bank-account-payment.component';

describe('BankAccountPaymentComponent', () => {
  let component: BankAccountPaymentComponent;
  let fixture: ComponentFixture<BankAccountPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
