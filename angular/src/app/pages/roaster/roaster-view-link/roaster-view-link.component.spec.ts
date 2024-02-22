import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoasterViewLinkComponent } from './roaster-view-link.component';

describe('RoasterComponent', () => {
  let component: RoasterViewLinkComponent;
  let fixture: ComponentFixture<RoasterViewLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoasterViewLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoasterViewLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
