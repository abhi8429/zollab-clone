import {Component} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {WorkspaceService} from "../../../services/workspace.service";
import {NavigationEnd, Router} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {filter, Subject} from "rxjs";
import {Role} from "../../../model/role";
import {Member} from "../../../model/member";
import {InviteWorkspaceMembersComponent} from "../../../modals/invite-workspace-members/invite-workspace-members.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {DeleteMemberComponent} from "../../../modals/delete-member/delete-member.component";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.component.html',
  styleUrls: ['./manage-members.component.css']
})
export class ManageMembersComponent {
  roles : Role[] | undefined
  selectedWorkspace!: Workspace;
  members!: Member[];
  modifiedMembers: [] | any = [];
  membersInvited: Subject<void> = new Subject<void>();
  loggedInUser : Member;
  constructor(private workspaceService: WorkspaceService,
              private router: Router,
              private roleService: RoleService,
              private dialog: NgbModal,
              private toastrService: ToastrService,
              private localStorageService: LocalStorageService,
              private sessionStorageService: SessionStorageService) {
    this.loggedInUser = this.localStorageService.retrieve('user');
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.getWorkspaceMembers();
        this.getRoles();
      });

  }

  getRoles() {
    this.roleService.getRoles(this.selectedWorkspace.id!).subscribe((response) => {
      this.roles = response;
    })
  }

  getWorkspaceMembers() {
    this.workspaceService.getMembers(this.selectedWorkspace.id!).subscribe((response) => {
      this.members = response;
    })
  }

  updateRole(member: Member, role: Role) {
    member.role = role;
    this.modifiedMembers = this.modifiedMembers.filter((item: { memberId: number }) => item.memberId !== member.memberId);
    this.modifiedMembers.push({
      memberId: member.memberId,
      role: {
        roleName: role.roleName
      }
    })

    console.log(this.modifiedMembers);

  }

  updateMembersRole() {
    this.roleService.updateMembersRole(this.selectedWorkspace.id!, this.modifiedMembers).subscribe((response) => {
      if(!!response) {
        // this.router.navigate(['']);
      }
    })
  }

  inviteMembers() {
    const modalRef = this.dialog.open(InviteWorkspaceMembersComponent);
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if(result.membersInvited) {
        this.membersInvited.next();
      }
      this.getWorkspaceMembers();
    })
  }

/*  removeMember(member: Member) {
    this.workspaceService.removeMember(this.selectedWorkspace.id!, member.memberId!).subscribe((response) => {
        this.toastrService.success('Member Removed From Workspace', 'Success');
        this.getWorkspaceMembers();
    });
  }*/

  removeMember(member: Member) {
    const modalRef = this.dialog.open(DeleteMemberComponent);
    modalRef.componentInstance.member = member;
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if(result.deleted) {
        if(this.loggedInUser.id === member.memberId) {
          this.sessionStorageService.clear('selectedWorkspace');
          this.router.navigate(['']);
        } else {
          this.getWorkspaceMembers();
        }
      }
    })
  }
}
