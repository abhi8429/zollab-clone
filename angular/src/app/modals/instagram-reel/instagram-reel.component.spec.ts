import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramReelComponent } from './instagram-reel.component';

describe('InstagramReelComponent', () => {
  let component: InstagramReelComponent;
  let fixture: ComponentFixture<InstagramReelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramReelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramReelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
