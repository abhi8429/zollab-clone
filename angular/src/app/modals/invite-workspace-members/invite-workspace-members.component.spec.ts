import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteWorkspaceMembersComponent } from './invite-workspace-members.component';

describe('InviteWorkspaceMembersComponent', () => {
  let component: InviteWorkspaceMembersComponent;
  let fixture: ComponentFixture<InviteWorkspaceMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteWorkspaceMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteWorkspaceMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
