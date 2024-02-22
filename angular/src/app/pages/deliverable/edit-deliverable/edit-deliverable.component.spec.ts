import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeliverableComponent } from './edit-deliverable.component';

describe('EditDeliverableComponent', () => {
  let component: EditDeliverableComponent;
  let fixture: ComponentFixture<EditDeliverableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDeliverableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
