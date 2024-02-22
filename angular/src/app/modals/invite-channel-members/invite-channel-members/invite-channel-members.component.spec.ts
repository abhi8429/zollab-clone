import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InviteChannelMembersComponent} from './invite-channel-members.component';

describe('InviteChannelMembersComponent', () => {
  let component: InviteChannelMembersComponent;
  let fixture: ComponentFixture<InviteChannelMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteChannelMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteChannelMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
