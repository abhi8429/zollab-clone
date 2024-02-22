import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangesNeededComponent} from './changes-needed.component';

describe('ChangesNeededComponent', () => {
  let component: ChangesNeededComponent;
  let fixture: ComponentFixture<ChangesNeededComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangesNeededComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangesNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
