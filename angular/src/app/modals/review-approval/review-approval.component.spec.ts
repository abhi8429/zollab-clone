import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewApprovalComponent } from './review-approval.component';

describe('ReviewApprovalComponent', () => {
  let component: ReviewApprovalComponent;
  let fixture: ComponentFixture<ReviewApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
