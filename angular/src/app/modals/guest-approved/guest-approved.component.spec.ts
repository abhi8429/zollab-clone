import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestApprovedComponent } from './guest-approved.component';

describe('GuestApprovedComponent', () => {
  let component: GuestApprovedComponent;
  let fixture: ComponentFixture<GuestApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
