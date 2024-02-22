import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {TransferOwnershipComponent} from "../transfer-ownership/transfer-ownership.component";
import {ProjectDetailsComponent} from "../project-details/project-details.component";
import {StarredMessagesComponent} from "../starred-messages/starred-messages.component";
import { ApiCallerService } from 'src/app/services/apiCallerService';
import { environment } from 'src/environments/environment';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import {PROJECT_MEMBER_TYPES, ProjectMember} from "../../model/project-member";
import {TeamMember} from "../../model/team-member";
import {Project} from "../../model/project";
import {Deliverable} from "../../model/deliverable";
import {User} from "../../model/user";
import {Role} from "../../model/role";
import {RoleService} from "../../services/role.service";
import {debounceTime, distinctUntilChanged, map, Observable, switchMap} from "rxjs";
import {RemoveMemberComponent} from "../remove-member/remove-member.component";
// declare var $: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit{
  starMessage:any=[];
  projectMembers: any = [] as ProjectMember;
  team: Team = {} as Team;
  teamMembers: any = [] as TeamMember;
  project: Project = {} as Project;
  deliverables: any = [] as Deliverable;
  user?: User;
  projectRoles: Role[] = [];
  selectedMemberRole?: string = PROJECT_MEMBER_TYPES.VIEWER;
  deletedMemberIds: number[] = [];
  duplicateEmailWarning: string | undefined;
  projectPermission: any = [];

  constructor(private activeModal:NgbActiveModal,private dialog:NgbModal, private apiCaller: ApiCallerService,
    private teamService: TeamService, private userService: UserService, private projectService: ProjectService,
              private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.getStarredMessageListAndCount();
    this.getRoles();
    this.getTeamMembers();
    this.getProjectMembers();
    this.getProjectPermission();
  }
  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }
  openProjectDetails(){
    this.activeModal.dismiss();
    const modalRef=this.openCalledPopup(ProjectDetailsComponent);
    this.addEscapeKeyListener(modalRef);
  }
  openStarredMessage(){
    if(this.starMessage.length>0){
      this.activeModal.close();
      this.activeModal.dismiss();
      const modalRef=this.openCalledPopup(StarredMessagesComponent);
      modalRef.componentInstance.receivedData = { key: this.starMessage, redirectFor:"starMsg"};
      this.addEscapeKeyListener(modalRef);
    }
  }

  getStarredMessageListAndCount() {
    let url = environment.baseUrl+"/zollab/api/v1/users/"+this.userService.userId+"/teams/"+this.teamService.selectedTeam.id+"/projects/"+this.projectService.selectedProject.id+"/messages/?star=true"
    this.apiCaller.getCall(url).subscribe(
      data => {
        this.starMessage = data;
      })
  }

  getProjectMembers() {
    if (this.projectService.selectedProject.id) {
      this.projectService.getMembers(this.teamService.selectedTeam.id!,this.projectService.selectedProject.id)
        .subscribe((projectMembers) => {
          this.projectMembers = projectMembers;
        });
    }
  }

  getTeamMembers() {
    this.teamService.getMembers(this.teamService.selectedTeam.id!)
      .subscribe((teamMembers) => {
        this.teamMembers = teamMembers;
      });
  }

  getRoles() {
    if (this.projectService.selectedProject.id) {
      this.roleService.getProjectRoles(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!).subscribe((roles) => {
        for (let role of roles) {
          this.projectRoles.push(role);
        }
      });
    } else {
      //this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.OWNER});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.EDITOR});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.APPROVER});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.VIEWER});
    }
  }

  search = (text: Observable<string>) => {
    return text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchText) => {
        return searchText.length >= 4 ? this.userService.searchUser(searchText)
          .pipe(map(users =>
            users.filter(user => {
              let existingMemberIds = this.projectMembers.map((projectMember: { memberId: any; }) => projectMember.memberId);
              existingMemberIds.push(this.teamService.userId);
              return !existingMemberIds.includes(user.id);
            }))) : [];
      })
    );
  }
  formatter = (x: { email: string }) => x.email;

  openOwnership() {
    let projectMember: any = {
      role: {
        roleName: this.selectedMemberRole
      }
    } as ProjectMember;
    if (this.user?.id) {
      projectMember.memberId = this.user.id;
      projectMember.memberName = this.user.name;
      projectMember.memberEmail = this.user.email;
    } else if (this.user) {
      projectMember.memberName = this.user;
      projectMember.memberEmail = this.user;
    } else {
      return;
    }
    if (this.isValidEmail(projectMember.memberEmail)) {
      if (!this.isDuplicateEmail(projectMember.memberEmail)) {
        this.projectMembers.push(projectMember);
        this.user = undefined;
        this.duplicateEmailWarning = undefined;
      } else {
        console.error('Duplicate email:', projectMember.memberEmail);
        this.duplicateEmailWarning = 'Duplicate email. Please enter a different email.';
        this.user = undefined;
        return;
      }
    } else {
      console.error('Invalid email:', projectMember.memberEmail);
      this.duplicateEmailWarning = 'Invalid email. Please enter a valid email address.';
      this.user = undefined;
      return;
    }
    this.user = undefined;
  }

  removeMember(index: number) {
    if (this.projectMembers[index].id) {
      this.activeModal.dismiss();
      const modalRef = this.dialog.open(RemoveMemberComponent);
      let text = `Are you sure you would like to remove your team member ${this.projectMembers[index]?.memberName ? this.projectMembers[index].memberName : this.projectMembers[index]?.memberEmail} from ${(this.projectService.selectedProject.title)}?`;
      modalRef.componentInstance.text = text;
      modalRef.result.then((result) => {
        if (!!result) {
          this.deletedMemberIds.push(this.projectMembers[index].memberId);
          this.projectMembers.splice(index, 1);
        }
      });
    } else {
      this.projectMembers.splice(index, 1);
    }
  }

  selectRole(selectedRole: Role) {
    this.selectedMemberRole = selectedRole.roleName;
  }

  save() {
      if (this.deletedMemberIds.length > 0) {
        this.projectService.removeMembers(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, this.deletedMemberIds).subscribe((response) => {
          this.projectService
            .inviteBulk(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, this.projectMembers).subscribe((projectMembers) => {
            this.projectMembers = projectMembers;
          });
        });
        this.close(this.team);
      } else {
        this.projectService
          .inviteBulk(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, this.projectMembers).subscribe((projectMembers) => {
          this.projectMembers = projectMembers;
        });
        this.close(this.team);
      }
   }

  isRemovable(index: number): boolean {
    return index > 0;
  }

  isDuplicateEmail(email: string): boolean {
    let some = this.projectMembers.some((member: TeamMember) => member.memberEmail === email);
    return some;
    this.user = undefined;
  }

  onEmailInputChange() {
    this.duplicateEmailWarning = undefined;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getProjectPermission(){
    this.projectPermission = [];
    this.projectService.projectPermission(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id! ).subscribe((project) => {
      this.projectPermission = project;
    });
  }

  openCalledPopup(componentName:any): any{
    const modalRef =this.dialog.open(componentName,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true, windowClass: 'custom-modal'});
    return modalRef;
  }

  addEscapeKeyListener(modalRef: any) {
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        modalRef.close();
      }
    };
    document.addEventListener('keydown', escapeListener);
    modalRef.result.finally(() => {
      document.removeEventListener('keydown', escapeListener);
    });
  }
}
