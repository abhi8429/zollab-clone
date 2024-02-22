import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverablePageComponent } from './deliverable-page.component';

describe('DeliverablePageComponent', () => {
  let component: DeliverablePageComponent;
  let fixture: ComponentFixture<DeliverablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverablePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
