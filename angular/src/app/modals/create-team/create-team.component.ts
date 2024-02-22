import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal,} from '@ng-bootstrap/ng-bootstrap';
import {Team} from "../../model/team";
import {TEAM_MEMBER_TYPES, TeamMember} from "../../model/team-member";
import {NgForm} from "@angular/forms";
import {TeamService} from "../../services/team.service";
import {User} from "../../model/user";
import {debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, switchMap} from "rxjs";
import {UserService} from "../../services/user.service";
import {RoleService} from "../../services/role.service";
import {Role} from "../../model/role";
import {RemoveMemberComponent} from "../remove-member/remove-member.component";
import {ContentService} from "../../services/content.service";
import {ProjectMember} from "../../model/project-member";

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css'],
  providers: [NgbModal],
})
export class CreateTeamComponent implements OnInit {
  imageUrl: any = 'assets/img/app-icon.svg';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('registerForm1') registerForm1!: NgForm;
  @Input() isEditing: boolean = false;
  headerText: string = "Create Team"; // Set a default value
  // @ViewChild('registerForm2') registerForm2!: NgForm;
  imageFile: File | undefined;
  imageFileName: string = '';
  teams: any;
  @Input()
  team: Team = {} as Team;
  user?: User;
  teamRoles: Role[] = [];
  teamMembers: any = [] as TeamMember;
  deletedMemberIds: number[] = [];
  selectedMemberRole?: string = TEAM_MEMBER_TYPES.GUEST;

  submitted: boolean = false;

  readonly AVATAR_BASE_URL;
  duplicateEmailWarning: string | undefined;
  emailRequiredWarning: string | undefined;
  constructor(public activeModal: NgbActiveModal,
              private userService: UserService,
              private teamService: TeamService,
              private roleService: RoleService,
              private contentService: ContentService,
              private dialog: NgbModal,
              ) {
    this.AVATAR_BASE_URL = contentService.getAvatarURL();
  }

  ngOnInit(): void {
    this.getRoles();
    this.getTeamMembers();
    this.getTeam();
    this.imageUrl = this.team.id && this.team.avatarUrl ? this.team.avatarUrl : 'assets/img/app-icon.svg';
    this.setModalHeader();
    // Call the method to set modal header
  }


  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }

  onImgError(event: any, index: number) {
    event.target.src = index % 2 === 0 ? 'assets/img/green-ball.webp' : 'assets/img/orange-ball.webp';
  }

  getMemberImgUrl(memberId: number): string {
    return `${this.AVATAR_BASE_URL}/${memberId}/PROFILE/dp_50X50.jpg`;
  }

  uploadFile(event: any) {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      }
      this.imageFile = file;
      this.imageFileName = file.name;
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
              let existingMemberIds = this.teamMembers.map((teamMember: { memberId: any; }) => teamMember.memberId);
              existingMemberIds.push(this.teamService.userId);
              return !existingMemberIds.includes(user.id);
            }))) : [];
      })
    );
  }
  formatter = (x: { email: string }) => x.email;

  inviteTeamMember(){
    let teamMember: any = {
      role: {
        roleName: this.selectedMemberRole
      }
    } as TeamMember;
    if (this.user?.id) {
      teamMember.memberId = this.user.id;
      teamMember.memberName = this.user.name;
      teamMember.memberEmail = this.user.email;
    } else if (this.user) {
      teamMember.memberName = this.user;
      teamMember.memberEmail = this.user;
    } else {
      return;
    }
    if (this.isValidEmail(teamMember.memberEmail)) {
      if (!this.isDuplicateEmail(teamMember.memberEmail)) {
        this.teamMembers.push(teamMember);
        this.user = undefined;
        this.duplicateEmailWarning = undefined;
      } else {
        console.error('Duplicate email:', teamMember.memberEmail);
        this.duplicateEmailWarning = 'Duplicate email. Please enter a different email.';
      }
    } else {
      console.error('Invalid email:', teamMember.memberEmail);
      this.duplicateEmailWarning = 'Invalid email. Please enter a valid email address.';
    }
    this.user = undefined;
  }

  selectRole(selectedRole: Role) {
    this.selectedMemberRole = selectedRole.roleName;
  }

  saveTeam() {
    this.submitted = true;
    if (this.registerForm1.invalid || this.teamMembers.length === 0) {
      this.emailRequiredWarning = 'Please enter at least one email address.';
      return;
    }

    if (this.team.id) {
      this.updateTeam();
    } else {
      this.createTeam();
    }
  }

  updateTeam() {
    this.teamService.update(this.team).subscribe((team) => {
      team.teamName = team.teamName;
      this.team = team;
      if (this.deletedMemberIds.length > 0) {
        this.teamService.removeMembers(this.team.id!, this.deletedMemberIds).subscribe((response) => {
          this.teamService.inviteBulk(this.team.id!, this.teamMembers).subscribe((teamMembers) => {
            this.teamMembers = teamMembers;
            this.close(this.team);
          });
        });
      } else {
        this.teamService.inviteBulk(this.team.id!, this.teamMembers).subscribe((teamMembers) => {
          this.teamMembers = teamMembers;
          this.close(this.team);
        });
      }
    });
    this.uploadImage();
  }

  async createTeam() {
    this.team = await firstValueFrom(this.teamService.create(this.team.teamName!));
    this.uploadImage();
    this.teamMembers = await firstValueFrom(this.teamService.inviteBulk(this.team.id!, this.teamMembers));
    this.close(this.team);
  }

  uploadImage() {
    if (this.imageFile) {
      const formData = new FormData();
      formData.append('file', this.imageFile, this.imageFileName);
      this.teamService.updateImage(this.team.id!, formData).subscribe((response) => {
        this.imageUrl = response.cdnUrl;
      });
    }
  }

  isRemovable(index: number): boolean {
    console.log('this.teamMembers[index].memberId', this.teamMembers[index].memberId);
    console.log(this.teamMembers[index].memberId === this.team.userId);
    console.log('this.team.userId', this.team.userId);
    if (this.teamMembers[index].id) {
      return !(this.teamMembers[index].memberId == this.team.userId);
    }
    return true;
  }

  removeMember(index: number) {
    if (this.teamMembers[index].id) {
      const modalRef = this.dialog.open(RemoveMemberComponent);
      let text = `Are you sure you would like to remove your team member ${this.teamMembers[index]?.memberName ? this.teamMembers[index].memberName : this.teamMembers[index]?.memberEmail} from ${this.team.teamName}?`;
      modalRef.componentInstance.text = text;
      modalRef.result.then((result) => {
        if (!!result) {
          this.deletedMemberIds.push(this.teamMembers[index].memberId);
          this.teamMembers.splice(index, 1);
        }
      });
    } else {
      this.teamMembers.splice(index, 1);
    }
  }


  getRoles() {
    if (this.team.id) {
      this.roleService.getRoles(this.team.id!).subscribe((roles) => {
        for (let role of roles) {
          this.teamRoles.push(role);
        }
      });
    } else {
      this.teamRoles.push({roleName: TEAM_MEMBER_TYPES.ADMIN});
      this.teamRoles.push({roleName: TEAM_MEMBER_TYPES.MANAGER});
      this.teamRoles.push({roleName: TEAM_MEMBER_TYPES.GUEST});
    }
  }

  getTeamMembers() {
    if (this.team.id) {
      this.teamService.getMembers(this.team.id).subscribe((teamMembers) => {
        this.teamMembers = teamMembers;
      });
    }
  }

  private setModalHeader() {
    if (this.isEditing) {
      this.headerText = "Edit Team";
    }
  }

  getTeam() {
    if (this.team.id) {;
      this.teamService.get(this.team.id).subscribe((teams) => {
       this.teams = teams;
        this.imageUrl = this.teams.id && this.teams.avatarUrl ? this.teams.avatarUrl : 'assets/img/app-icon.svg';
      });
    }
  }

  isDuplicateEmail(email: string): boolean {
    let some = this.teamMembers.some((member: TeamMember) => member.memberEmail === email);
    return some;
  }

  onEmailInputChange() {
    this.duplicateEmailWarning = undefined;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  emailWarning(){
    this.emailRequiredWarning = undefined;
  }
}
