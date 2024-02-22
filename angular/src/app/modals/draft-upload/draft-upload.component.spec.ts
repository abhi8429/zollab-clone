import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftUploadComponent } from './draft-upload.component';

describe('DraftUploadComponent', () => {
  let component: DraftUploadComponent;
  let fixture: ComponentFixture<DraftUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
