import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Workspace} from "../../model/workspace";
import {UserService} from "../../services/user.service";
import {debounceTime, distinctUntilChanged, Observable, switchMap} from "rxjs";
import {User} from "../../model/user";
import {WorkspaceService} from "../../services/workspace.service";
import {HttpStatusCode} from "@angular/common/http";
import {RoleService} from "../../services/role.service";
import {Role} from "../../model/role";

@Component({
  selector: 'app-invite-workspace-members',
  templateUrl: './invite-workspace-members.component.html',
  styleUrls: ['./invite-workspace-members.component.css'],
})
export class InviteWorkspaceMembersComponent implements OnInit {
  @Input() workspace!: Workspace;
  inviteUrl!: string;
  user!: User;
  workspaceRoles: Role[] | undefined;
  selectedRole: any;
  constructor(public activeModal: NgbActiveModal, private userService: UserService,
              private workspaceService: WorkspaceService, private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.getRoles();
    this.inviteUrl = `https://devdeal.stella.so/${this.workspace?.inviteCode}`;
  }

  search = (text: Observable<string>) => {
    return text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchText) =>
        searchText.length >= 4 ? this.userService.searchUser(searchText) : []
      )
    );
  }
  formatter = (x: { email: string }) => x.email;

  inviteMember() {
    if(this.selectedRole === undefined) {
      return;
    }
    let member: any = {};
    member = {
      role : {
        roleName: this.selectedRole
      },
    }
    if(this.user.id) {
      member.memberId = this.user.id;
    } else if(this.user) {
      member.memberName = this.user;
      member.memberEmail = this.user;
    } else {
      return;
    }
    this.workspaceService.invite(this.workspace.id!, member).subscribe((response) => {
      console.log(response);
      if(response.status === HttpStatusCode.Ok) {
        this.activeModal.close({membersInvited: true});
      }
    })
  }

  getRoles() {
    this.roleService.getRoles(this.workspace.id!).subscribe((response) => {
      this.workspaceRoles = response;
    })
  }
}
