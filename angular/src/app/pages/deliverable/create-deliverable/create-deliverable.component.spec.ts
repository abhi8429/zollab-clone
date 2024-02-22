import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeliverableComponent } from './create-deliverable.component';

describe('CreateDeliverableComponent', () => {
  let component: CreateDeliverableComponent;
  let fixture: ComponentFixture<CreateDeliverableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDeliverableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
