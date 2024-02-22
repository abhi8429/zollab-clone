import {Component} from '@angular/core';
import {RemoveMemberComponent} from "../../../modals/remove-member/remove-member.component";
import {Member, TEAM_MEMBER_TYPES, TeamMember} from "../../../model/team-member";
import {debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, switchMap} from "rxjs";
import {Role} from "../../../model/role";
import {Team} from "../../../model/team";
import {User} from "../../../model/user";
import {NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TeamService} from "../../../services/team.service";
import {RoleService} from "../../../services/role.service";
import {ContentService} from "../../../services/content.service";
import {ProjectService} from "../../../services/project.service";
import {PROJECT_MEMBER_TYPES, ProjectMember} from "../../../model/project-member";
import {Project} from "../../../model/project";
import {ProjectDeliverableService} from "../../../services/proiect.deliverable.service";
import {Router} from "@angular/router";
import {Deliverable} from "../../../model/deliverable";
import {SessionStorageService} from "ngx-webstorage";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-invite',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css']
})
export class InviteMemberComponent {

  teamImageUrl: any = 'assets/img/profile-finger-icon.webp';
  team: Team = {} as Team;
  teamMembers: any = [] as TeamMember;
  project: Project = {} as Project;
  deliverables: any = [] as Deliverable;
  user?: User;
  projectRoles: Role[] = [];
  projectMembers: any = [] as ProjectMember;
  deletedMemberIds: number[] = [];
  selectedMemberRole?: string = PROJECT_MEMBER_TYPES.VIEWER;
  submitted: boolean = false;
  readonly AVATAR_BASE_URL;
  emailContactId: any;
  duplicateEmailWarning: string | undefined;
  showNoProjectMembersWarning: boolean = false;
  showNoCreatorRoleWarning: boolean = false;
  constructor(private projectService: ProjectService,
              private deliverableService: ProjectDeliverableService,
              private teamService: TeamService,
              private userService: UserService,
              private roleService: RoleService,
              private contentService: ContentService,
              private sessionStorageService: SessionStorageService,
              private router: Router,
              private dialog: NgbModal) {
    this.AVATAR_BASE_URL = contentService.getAvatarURL();
    let projectStore = this.sessionStorageService.retrieve('project');
    if (!projectStore) {
      this.router.navigate(['create-project']);
      return;
    }
    this.emailContactId = projectStore.emailContractId;
    console.log(this.emailContactId);
    this.project = projectStore.project;
    this.project.projectEmailContractId = this.emailContactId;
    this.deliverables = projectStore.deliverables;
    if (projectStore.members && projectStore.members.length > 0) {
      this.projectMembers = projectStore.members;
    }

  }

  ngOnInit(): void {
    this.team = this.teamService.selectedTeam;
    this.teamImageUrl = this.team.avatarUrl;
    this.getRoles();
    this.getTeamMembers();
    this.getProjectMembers();
  }

  teamImageError() {
    this.teamImageUrl = 'assets/img/profile-finger-icon.webp';
  }

  onImgError(event: any, index: number) {
    event.target.src = index % 2 === 0 ? 'assets/img/green-ball.webp' : 'assets/img/orange-ball.webp';
  }

  getMemberImgUrl(memberId: number): string {
    return `${this.AVATAR_BASE_URL}/${memberId}/PROFILE/dp_50X50.jpg`;
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

  inviteProjectMember() {
    this.showNoProjectMembersWarning = false;
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
    const addedMember = this.projectMembers[this.projectMembers.length - 1];
    if (addedMember.role.roleName === PROJECT_MEMBER_TYPES.CREATOR) {
      this.showNoCreatorRoleWarning = false;
    }
    this.user = undefined;
  }

  selectRole(selectedRole: Role) {
    this.selectedMemberRole = selectedRole.roleName;
  }

  saveProject() {
    this.submitted = true;
    if (this.projectMembers.length === 0) {
      this.showNoProjectMembersWarning = true;
      return
    }
    const hasCreatorRole = this.projectMembers.some((member: { role: { roleName: PROJECT_MEMBER_TYPES; }; }) => member.role.roleName === PROJECT_MEMBER_TYPES.CREATOR);
    if (!hasCreatorRole) {
      this.showNoCreatorRoleWarning = true;
      return;
    }
    this.formatDateBeforeSave();
    if (this.project.id) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }

  formatDateBeforeSave(){
   
    this.project.projectStartedAt =this.dateToSave(this.project.projectStartedAt);
    this.project.firstUseAt =this.dateToSave(this.project.firstUseAt);
    this.project.expirationFromFirstUseAt =this.dateToSave(this.project.expirationFromFirstUseAt);
  }
  dateToSave(dateString:any) : any{
    const dateParts = dateString.date;
    const year = dateString.year;
    const month =dateString.month - 1; // Months are zero-based in JavaScript
    const day = dateString.day;

  const date = new Date(year, month, day)
  return date;
  }
  updateProject() {
    if (this.deletedMemberIds.length > 0) {
      this.projectService.removeMembers(this.team.id!, this.project.id!, this.deletedMemberIds).subscribe((response) => {
        // this.createProject();
      });
    } else {
      /* this.projectService.inviteBulk(this.team.id!, this.project.id!, this.projectMembers).subscribe((projectMembers) => {
         this.projectMembers = projectMembers;
       });*/
      // this.addProjectMember();
    }
  }

  createProject() {
    let teamId = this.teamService.selectedTeam.id;
    this.project.projectStartedAt
    this.projectService.create(teamId!, this.project).subscribe((project) => {
      this.project = project;
      this.deliverableService.createOrUpdate(teamId!, project.id!, this.deliverables).subscribe((deliverables) => {
        this.projectService
          .inviteBulk(this.team.id!, this.project.id!, this.projectMembers).subscribe((projectMembers) => {
          this.sessionStorageService.clear('project');
          this.projectService.setSelectedProject(this.project);
          this.router.navigate(['chat-dashboard']);
        });
      });
    });
  }

  isRemovable(index: number): boolean {
    if (this.projectMembers[index].id) {
      return !(this.projectMembers[index].memberId === this.team.userId);
    }
    return true;
  }

  removeMember(index: number) {
    if (this.projectMembers[index].id) {
      const modalRef = this.dialog.open(RemoveMemberComponent);
      let text = `Are you sure you would like to remove your project member ${this.projectMembers[index]?.memberName} from ${this.project.title}?`;
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

  getRoles() {
    if (this.project.id) {
      this.roleService.getProjectRoles(this.team.id!, this.project.id!).subscribe((roles) => {
        for (let role of roles) {
          this.projectRoles.push(role);
        }
      });
    } else {
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.APPROVER});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.CREATOR});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.EDITOR});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.OWNER});
      this.projectRoles.push({roleName: PROJECT_MEMBER_TYPES.VIEWER});
    }
  }

  getProjectMembers() {
    if (this.project.id) {
      this.projectService.getMembers(this.team.id!, this.project.id)
        .subscribe((projectMembers) => {
          this.projectMembers = projectMembers;
        });
    }
  }

  get showInviteTeam() {
    for (let teamMember of this.teamMembers) {
      if (teamMember.role.roleName === TEAM_MEMBER_TYPES.ADMIN) {
        continue;
      }
      let found = this.projectMembers.some((projectMember: { memberId: any; }) => projectMember.memberId == teamMember.memberId);
      if (!found) {
        return true;
      }
    }
    return false;
  }

  inviteTeam() {
    this.showNoProjectMembersWarning = false;
    for (let teamMember of this.teamMembers) {
      let found = this.projectMembers.some((projectMember: { memberId: any; }) => projectMember.memberId == teamMember.memberId);
      if (teamMember.role.roleName === TEAM_MEMBER_TYPES.ADMIN || found) {
        continue;
      }
      let projectMember: any = {
        memberId: teamMember.memberId,
        memberName: teamMember.memberName,
        memberEmail: teamMember.memberEmail,
        role: {
          roleName: PROJECT_MEMBER_TYPES.VIEWER
        }
      } as Member;
      this.projectMembers.push(projectMember);
    }
  }

  getTeamMembers() {
    this.teamService.getMembers(this.team.id!)
      .subscribe((teamMembers) => {
        this.teamMembers = teamMembers;
      });
  }

  back() {
    let projectStore = this.sessionStorageService.retrieve('project');
    this.project = projectStore.members = this.projectMembers;
    this.router.navigate(['deliverable-page']);
  }

  isDuplicateEmail(email: string): boolean {
    let some = this.projectMembers.some((member: TeamMember) => member.memberEmail === email);
    return some;
  }

  onEmailInputChange() {
    this.duplicateEmailWarning = undefined;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  selectRoles(selectedRole: Role, projectMember: any) {
    if (selectedRole.roleName === PROJECT_MEMBER_TYPES.CREATOR) {
      this.showNoCreatorRoleWarning = false;
    }
    projectMember.role.roleName = selectedRole.roleName;
  }
}
