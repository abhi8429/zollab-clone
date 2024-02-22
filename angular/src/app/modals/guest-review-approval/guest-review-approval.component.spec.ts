import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestReviewApprovalComponent } from './guest-review-approval.component';

describe('GuestReviewApprovalComponent', () => {
  let component: GuestReviewApprovalComponent;
  let fixture: ComponentFixture<GuestReviewApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestReviewApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestReviewApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
