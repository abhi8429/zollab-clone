import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShareRosterComponent} from './share-roster.component';

describe('ShareRosterComponent', () => {
  let component: ShareRosterComponent;
  let fixture: ComponentFixture<ShareRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareRosterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
