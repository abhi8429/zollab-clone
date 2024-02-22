import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredMessagesComponent } from './starred-messages.component';

describe('StarredMessagesComponent', () => {
  let component: StarredMessagesComponent;
  let fixture: ComponentFixture<StarredMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarredMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarredMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
