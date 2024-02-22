import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipFileComponent } from './zip-file.component';

describe('ZipFileComponent', () => {
  let component: ZipFileComponent;
  let fixture: ComponentFixture<ZipFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZipFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZipFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
