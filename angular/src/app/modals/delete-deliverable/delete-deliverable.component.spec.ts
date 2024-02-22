import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteDeliverableComponent} from './delete-deliverable.component';

describe('DeleteDeliverableComponent', () => {
  let component: DeleteDeliverableComponent;
  let fixture: ComponentFixture<DeleteDeliverableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDeliverableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
