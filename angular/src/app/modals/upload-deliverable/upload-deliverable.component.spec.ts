import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeliverableComponent } from './upload-deliverable.component';

describe('UploadDeliverableComponent', () => {
  let component: UploadDeliverableComponent;
  let fixture: ComponentFixture<UploadDeliverableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDeliverableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
