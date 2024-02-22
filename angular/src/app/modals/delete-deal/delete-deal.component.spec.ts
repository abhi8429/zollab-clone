import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteDealComponent} from './delete-deal.component';

describe('DeleteDealComponent', () => {
  let component: DeleteDealComponent;
  let fixture: ComponentFixture<DeleteDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDealComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
