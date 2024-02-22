import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipSplashComponent } from './tooltip-splash.component';

describe('TooltipSplashComponent', () => {
  let component: TooltipSplashComponent;
  let fixture: ComponentFixture<TooltipSplashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TooltipSplashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TooltipSplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
