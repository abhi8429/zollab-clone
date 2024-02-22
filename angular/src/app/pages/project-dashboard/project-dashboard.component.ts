import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreateTeamComponent} from "../../modals/create-team/create-team.component";
import {ProfileComponent} from "../../modals/profile/profile.component";
import {Team} from "../../model/team";
import {TeamService} from "../../services/team.service";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../services/content.service";
import {ProjectService} from "../../services/project.service";
import {Projects} from "@angular/cli/lib/config/workspace-schema";
import {Project} from "../../model/project";
import {ProjectDeliverable} from "../../model/project-deliverable";
import {ProjectDeliverableService} from "../../services/proiect.deliverable.service";
import {firstValueFrom} from "rxjs";
import {UploadDeliverableComponent} from "../../modals/upload-deliverable/upload-deliverable.component";
import { ProjectMember } from 'src/app/model/project-member';
import { Member } from 'src/app/model/member';
import {isRegExp} from "lodash-es";
import { GoogleLoginSuccessService } from 'src/app/services/google-login-success';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent {

  team?: Team;
  projects: Project[] = [];
  project: Project[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('pendingApprovalCheckbox') pendingApprovalCheckbox!: ElementRef<HTMLInputElement>;
  @ViewChild('completeCheckbox') completeCheckbox!: ElementRef<HTMLInputElement>;
  public showScrollToTop =false;
  readonly AVATAR_BASE_URL='';
  selectedOption: string = 'All';
  activeButton:string='All';
  teamPermission: any = [];
  constructor(private teamService: TeamService,
              private projectService: ProjectService,
              private deliverableService: ProjectDeliverableService,
              private sessionStorageService: SessionStorageService,
              private router: Router, private localStorageService: LocalStorageService,
              private dialog:NgbModal, private contentService: ContentService,
              private googleAuthService: GoogleLoginSuccessService
             ) {
             
    this.AVATAR_BASE_URL = contentService.getAvatarURL();
    this.loadData();
  }
  ngOnInit(): void {
    this.getTeamPermission();
  }

  loadData() {
    this.team = this.teamService.selectedTeam;
    if (this.team) {
      this.projectService.projectStatus(this.team.id!, 'ALL').subscribe((projects) => {
        this.projects = projects;
        this.project = projects;
        this.projects.forEach((project) => {
         this.getProjectMemberId(project);
          this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
            project.deliverables = deliverables;
          })
        })
      })
    }
  }

  teamAvatarImgError(event: any) {
    event.target.src = 'assets/img/profile-finger-icon.webp';
  }

  selectProject(project: Project) {
    this.projectService.setSelectedProject(project)
    this.router.navigate(['chat-dashboard']);
  }

  createProject() {
    this.sessionStorageService.clear('project');
    this.router.navigate(['create-project']);
  }

  get isProjectAvailable() {
    return this.team && this.project.length > 0;
  }
  onScroll(event: Event): void {
    // Check the scroll position of the scrollContainer
    if(this.scrollContainer)
      this.showScrollToTop = this.scrollContainer.nativeElement.scrollTop > 100;
  }

  scrollToTop(): void {
    // Scroll to the top of the scrollContainer div
    this.scrollContainer.nativeElement.scrollTop = 0;
  }

  getProjectMemberId(project: Project) {
    project.projectMemberImage=[];
    project.memberIds?.forEach((item:String) => {
      project.projectMemberImage?.push(`${this.AVATAR_BASE_URL}/${item}/PROFILE/dp_50X50.jpg?ver=` + Math.random());
    });
  }

  projectMemberImage:any=[];
  tooltipContent: string = '';
  showImages = false;

  getTooltipContent(): string {
    const maxDisplayedImages = 2;
    let tooltipContent = '';

    for (let i = 0; i < Math.min(this.projectMemberImage.length, maxDisplayedImages); i++) {
      let pimg = this.projectMemberImage[i];
      tooltipContent += `<img src="${this.AVATAR_BASE_URL}/${pimg}" alt="User Image">`;
    }

    return tooltipContent;
  }
  // toggleButton(buttonId: string): void {
  //   if (this.activeButton !== buttonId) {
  //     // Clicked on a different button, select it
  //     this.activeButton = buttonId;
  //   }
  // }

  dueNow(buttonId:string) {
    this.activeButton=buttonId;
    const pendingApprovalSelected = this.pendingApprovalCheckbox.nativeElement.checked;
    const completeSelected = this.completeCheckbox.nativeElement.checked;
    this.selectedOption = 'DUE_NOW';
    this.team = this.teamService.selectedTeam;
    if (this.team) {
      if (pendingApprovalSelected && completeSelected) {
          this.projectService.projectAndDeliverableStatus(this.team.id!, 'DUE_NOW','PENDING_APPROVAL,COMPLETE').subscribe((projects) => {
            this.projects = projects;
            this.projects.forEach((project) => {
              this.getProjectMemberId(project);
              this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                project.deliverables = deliverables;
              })
            })
          })
        } else if (pendingApprovalSelected) {
            this.projectService.projectAndDeliverableStatus(this.team.id!,'DUE_NOW','PENDING_APPROVAL').subscribe((projects) => {
              this.projects = projects;
              this.projects.forEach((project) => {
                this.getProjectMemberId(project);
                this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                  project.deliverables = deliverables;
                })
              })
            })
          } else if (completeSelected) {
              this.projectService.projectAndDeliverableStatus(this.team.id!,'DUE_NOW','COMPLETE').subscribe((projects) => {
                this.projects = projects;
                this.projects.forEach((project) => {
                  this.getProjectMemberId(project);
                  this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                    project.deliverables = deliverables;
                  })
                })
              })
            } else {
                this.projectService.projectStatus(this.team.id!,'DUE_NOW' ).subscribe((projects) => {
                  this.projects = projects;
                  this.projects.forEach((project) => {
                    this.getProjectMemberId(project);
                    this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                      project.deliverables = deliverables;
                    })
                  })
                })
              }
            }
          }

  upcoming(buttonId : string) {
    this.activeButton=buttonId;
    const pendingApprovalSelected = this.pendingApprovalCheckbox.nativeElement.checked;
    const completeSelected = this.completeCheckbox.nativeElement.checked;
    this.selectedOption = 'UPCOMING';
    this.team = this.teamService.selectedTeam;
    if (this.team) {
      if (pendingApprovalSelected && completeSelected) {
          this.projectService.projectAndDeliverableStatus(this.team.id!,'UPCOMING','PENDING_APPROVAL,COMPLETE').subscribe((projects) => {
            this.projects = projects;
            this.projects.forEach((project) => {
              this.getProjectMemberId(project);
              this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                project.deliverables = deliverables;
              })
            })
          })
        } else if (pendingApprovalSelected) {
            this.projectService.projectAndDeliverableStatus(this.team.id!,'UPCOMING','PENDING_APPROVAL').subscribe((projects) => {
              this.projects = projects;
              this.projects.forEach((project) => {
                this.getProjectMemberId(project);
                this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                  project.deliverables = deliverables;
                })
              })
            })
          } else if (completeSelected) {
              this.projectService.projectAndDeliverableStatus(this.team.id!, 'UPCOMING','COMPLETE').subscribe((projects) => {
                this.projects = projects;
                this.projects.forEach((project) => {
                  this.getProjectMemberId(project);
                  this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                    project.deliverables = deliverables;
                  })
                })
              })
            } else {
                this.projectService.projectStatus(this.team.id!,'UPCOMING').subscribe((projects) => {
                  this.projects = projects;
                  this.projects.forEach((project) => {
                    this.getProjectMemberId(project);
                    this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                      project.deliverables = deliverables;
                    })
                  })
                })
              }
            }
          }
          all(buttonId : string) {
            this.activeButton=buttonId;
            const pendingApprovalSelected = this.pendingApprovalCheckbox.nativeElement.checked;
            const completeSelected = this.completeCheckbox.nativeElement.checked;
            this.selectedOption = 'ALL';
            this.team = this.teamService.selectedTeam;
            if (this.team) {
              if (pendingApprovalSelected && completeSelected) {
                  this.projectService.projectAndDeliverableStatus(this.team.id!, 'ALL','PENDING_APPROVAL,COMPLETE').subscribe((projects) => {
                    this.projects = projects;
                    this.projects.forEach((project) => {
                      this.getProjectMemberId(project);
                      this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                        project.deliverables = deliverables;
                      })
                    })
                  })
                } else if (pendingApprovalSelected) {
                    this.projectService.projectAndDeliverableStatus(this.team.id!, 'ALL','PENDING_APPROVAL').subscribe((projects) => {
                      this.projects = projects;
                      this.projects.forEach((project) => {
                        this.getProjectMemberId(project);
                        this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                          project.deliverables = deliverables;
                        })
                      })
                    })
                  } else if (completeSelected) {
                      this.projectService.projectAndDeliverableStatus(this.team.id!, 'ALL','COMPLETE').subscribe((projects) => {
                        this.projects = projects;
                        this.projects.forEach((project) => {
                          this.getProjectMemberId(project);
                          this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                            project.deliverables = deliverables;
                          })
                        })
                      })
                    } else {
                        this.projectService.projectStatus(this.team.id!,'ALL').subscribe((projects) => {
                          this.projects = projects;
                          this.projects.forEach((project) => {
                            this.getProjectMemberId(project);
                            this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                              project.deliverables = deliverables;
                            })
                          })
                        })
                      }
                    }
                  }

  pendingApproval(event: any) {
    this.team = this.teamService.selectedTeam;
    if(this.selectedOption) {
      if (!event.target.checked && this.completeCheckbox.nativeElement.checked) {
        this.completeApi(this.selectedOption);
      } else if (event.target.checked && this.completeCheckbox.nativeElement.checked) {
        this.CompleteSelectedPendingApprovalApi(this.selectedOption);
      } else if (!event.target.checked && !this.completeCheckbox.nativeElement.checked) {
        this.projectService.projectStatus(this.team.id!, this.selectedOption).subscribe((projects) => {
          this.projects = projects;
          this.projects.forEach((project) => {
            this.getProjectMemberId(project);
            this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
              project.deliverables = deliverables;
            })
          })
        })
      } else if (event.target.checked) {
        this.pendingApprovalApi(this.selectedOption);
      }
    }
  }

  complete(event: any) {
    this.team = this.teamService.selectedTeam;
    if(this.selectedOption) {
      if (!event.target.checked && this.pendingApprovalCheckbox.nativeElement.checked) {
        this.pendingApprovalApi(this.selectedOption);
      } else if (event.target.checked && this.pendingApprovalCheckbox.nativeElement.checked) {
        this.CompleteSelectedPendingApprovalApi(this.selectedOption);
      } else if (!event.target.checked && !this.pendingApprovalCheckbox.nativeElement.checked) {
        this.projectService.projectStatus(this.team.id!, this.selectedOption).subscribe((projects) => {
          this.projects = projects;
          this.projects.forEach((project) => {
            this.getProjectMemberId(project);
            this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
              project.deliverables = deliverables;
            })
          })
        })
      } else if (event.target.checked) {
        this.completeApi(this.selectedOption);
      }
    }
  }

    pendingApprovalApi(periodStatus: string){
      this.team = this.teamService.selectedTeam;
      if (this.team) {
          this.projectService.projectAndDeliverableStatus(this.team.id!, periodStatus, 'PENDING_APPROVAL').subscribe((projects) => {
            this.projects = projects;
            this.projects.forEach((project) => {
              this.getProjectMemberId(project);
              this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                project.deliverables = deliverables;
              })
            })
          })
        }
      }
        completeApi(periodStatus: string){
          this.team = this.teamService.selectedTeam;
          if (this.team) {
              this.projectService.projectAndDeliverableStatus(this.team.id!, periodStatus,'COMPLETE').subscribe((projects) => {
                this.projects = projects;
                this.projects.forEach((project) => {
                  this.getProjectMemberId(project);
                  this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                    project.deliverables = deliverables;
                  })
                })
              })
            }
          }
            CompleteSelectedPendingApprovalApi(periodStatus: string){
              this.team = this.teamService.selectedTeam;
              if (this.team) {
                  this.projectService.projectAndDeliverableStatus(this.team.id!, periodStatus, 'PENDING_APPROVAL,COMPLETE').subscribe((projects) => {
                    this.projects = projects;
                    this.projects.forEach((project) => {
                      this.getProjectMemberId(project);
                      this.deliverableService.getAll(this.team?.id!, project.id!).subscribe((deliverables) => {
                        project.deliverables = deliverables;
                      })
                    })
                  })
                }
              }

  getTeamPermission(){
    this.teamPermission = [];
    this.teamService.teamPermission(this.teamService.selectedTeam.id! ).subscribe((teamMembers) => {
      this.teamPermission = teamMembers;
    });
  }
  imageErrors: string[] = [];

  handleImageError(event: any) {
      // this.imageErrors.push(imageUrl);
      event.target.src = '../../../assets/img/foreign-boy-icon.webp';
  }

  }
