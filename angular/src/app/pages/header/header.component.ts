import {Component, EventEmitter, Output} from '@angular/core';
import {Team} from "../../model/team";
import {NgbModal,NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {TeamService} from "../../services/team.service";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {AuthService} from "../../auth/auth.service";
import {ContentService} from "../../services/content.service";
import {Router} from "@angular/router";
import {CreateTeamComponent} from "../../modals/create-team/create-team.component";
import {ProfileComponent} from "../../modals/profile/profile.component";
import {UserNotificationService} from "../../services/user-notification.service";
import {UserNotification} from "../../model/user-notification";
import { Location } from '@angular/common';
import { ProjectService } from 'src/app/services/project.service';
import { CommonServices } from 'src/app/services/commonService';
import {GuestReviewApprovalComponent} from "../../modals/guest-review-approval/guest-review-approval.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  teams: Team[] = [];
  notifications: any = [] as UserNotification;
  teamIndex = 0;
  readonly AVATAR_BASE_URL;
  userId?: number;
  profileImageVer = 1;
  @Output() teamChanged = new EventEmitter<void>();
  teamId?: number;
  notificationsCount: number = 0;
  intervalId?: any;
  teamPermission: any = [];

  constructor(private dialog: NgbModal,
              private teamService: TeamService,
              private localStorageService: LocalStorageService,
              private sessionStorageService: SessionStorageService,
              private authService: AuthService,
              private contentService: ContentService,
              private notificationService: UserNotificationService,
              private router: Router,private location: Location,
              private config: NgbModalConfig, private projectService: ProjectService, public commonService: CommonServices) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.AVATAR_BASE_URL = contentService.getAvatarURL();
  }
  selectedTeam!:Team;
  ngOnInit(): void {
    this.userId = this.localStorageService.retrieve('user').id;
    this.teamService.getAll().subscribe((teams) => {
      this.teams = teams;
      if (teams.length === 0) {
        this.createTeam();
      } else {
        if(!this.teamService.selectedTeam)
          this.changeTeam(0);
        else
        this.selectedTeam=this.teamService.selectedTeam
      }
    });
    this.startLoadingUnreadCount();
    this.loadNotifications();
    this.getTeamPermission();
  }

  loadNotifications() {
    this.notificationService.getAll()
      .subscribe((notifications) => {
        this.notifications = notifications;
        console.log(notifications);
        this.notificationsCount = notifications.length;
      })
  }

  getMemberImgUrl(): string {
    return `${this.AVATAR_BASE_URL}/${this.userId}/PROFILE/dp_50X50.jpg?ver=` + this.profileImageVer;
  }

  onImgError(event: any, defaultImg:string) {
    event.target.src = defaultImg;
  }

  createTeam() {
    const modalRef = this.dialog.open(CreateTeamComponent, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: true,
      centered: true,
      windowClass: 'custom-modal'
    });
    modalRef.result.then((result) => {
      if (result) {
        this.teams.push(result.team);
        const newIndex = this.teams.length - 1;
        this.changeTeam(newIndex);
      }
    }).catch(() => {
    });

    this.addEscapeKeyListener(modalRef);
  }

  changeTeam(index: any) {
    this.teamIndex = index;
    console.log("index-----"+index)
    this.selectedTeam=this.teams[index];
    this.teamService.setSelectedTeam(this.teams[index]);
    this.teamChanged.emit();
    this.getTeamPermission();
    this.router.navigate(['project-dashboard']);
  }

  editTeam() {
    const modalRef = this.dialog.open(CreateTeamComponent,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true,windowClass: 'custom-modal'});
    modalRef.componentInstance.team = this.teamService.selectedTeam;
    modalRef.componentInstance.isEditing = true; // Set isEditing property
    modalRef.result.then((response) => {
      if (response) {
        console.log(response.team);
        // this.teams = this.teams.map(team => team.id === response.team.id ? response.team : team);
        this.teams[this.teamIndex] = response.team;
      }
    }).catch((onabort) => {
    });
    this.addEscapeKeyListener(modalRef);
  }

  profile() {
    const modalRef = this.dialog.open(ProfileComponent,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true,windowClass: 'custom-modal'});
    modalRef.result.then((response) => {
      this.profileImageVer = Math.random();
    })
    this.addEscapeKeyListener(modalRef);
  }

  createProject() {
    this.sessionStorageService.clear('project');
    this.router.navigate(['create-project']);
  }

  listProject() {
    this.router.navigate(['project-dashboard']);
  }

  logout() {
    this.stopLoadingUnreadCount();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  // createNewProject() {
  //   const modalRef = this.dialog.open(CreateProjectComponent);
  // }
  unreadCount:number=0;
  loadUnreadCount() {
    this.notificationService.getUnreadCount()
      .subscribe((notifications: any) => {
        this.unreadCount = notifications;
        console.log("unread count --"+notifications);
      });
  }

  readAll() {
    this.notificationService.readAll()
      .subscribe((notifications: UserNotification[]) => {
        this.unreadCount = 0;
      });
  }

  update(notification: any) {
    notification.read = true;
    this.notificationService.update(notification, notification?.key.id!)
      .subscribe((notifications: UserNotification[]) => {
        this.unreadCount -=1;
      });
  }

  team?:Team;
  redirectToNotificationItem(notification:any){
    if(notification.metaData.redirectTo=='TEAM'){
      this.teamService.getById(notification.metaData.teamId).subscribe((response) => {
        this.teamService.setSelectedTeam(response);
        this.selectedTeam=response;
        this.router.navigate(['project-dashboard'])
      })
    }

    if(notification.metaData.redirectTo=='CHAT'){
      this.teamService.getById(notification.metaData.teamId).subscribe((response) => {
        this.teamService.setSelectedTeam(response);
        this.selectedTeam=response;
      })
      this.projectService.getProjectById(notification.metaData.teamId,notification.metaData.projectId).subscribe((response) => {
      this.projectService.setSelectedProject(response);
      this.router.navigate(['chat-dashboard'])
    })
    }
  };

  startLoadingUnreadCount() {
    this.loadUnreadCount();
    this.intervalId = setInterval(() => {
      this.loadUnreadCount();
    }, 60000);
  }

  stopLoadingUnreadCount() {
    clearInterval(this.intervalId);
  }
  getTeamPermission(){
    this.teamPermission = [];
    this.teamService.teamPermission(this.teamService.selectedTeam.id! ).subscribe((teamMembers) => {
      this.teamPermission = teamMembers;
    });
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
