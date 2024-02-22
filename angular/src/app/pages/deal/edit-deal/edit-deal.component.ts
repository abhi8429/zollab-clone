import {Component, HostListener} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {DealService} from "../../../services/deal.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, Observable, Subject} from "rxjs";
import {Attachment, Deal} from "../../../model/deal";
import {Deliverable} from "../../../model/deliverable";
import {FormBuilder, Validators} from "@angular/forms";
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DeleteDealComponent} from "../../../modals/delete-deal/delete-deal.component";
import {ViewportScroller} from "@angular/common";
import {find, pull} from "lodash";
import {AuthService} from "../../../auth/auth.service";
import {WorkspaceService} from "../../../services/workspace.service";
import {SessionStorageService} from "ngx-webstorage";
import {Member, MEMBER_TYPES} from "../../../model/member";
import {
  InviteWorkspaceMembersComponent
} from "../../../modals/invite-workspace-members/invite-workspace-members.component";
import {ComponentCanDeactivate} from "../../../auth/pending-changes-guard.guard";

@Component({
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css']
})
export class EditDealComponent implements ComponentCanDeactivate {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.dealForm.dirty) {
      return false;
      // return confirm('Are you sure you want to navigate away and lose changes to the form?');
    }
    return true;
  }

  selectedWorkspace!: Workspace;
  hideLeftMenu: boolean = true;
  selectedDeal!: Deal;
  deliverables!: Deliverable[];
  attachments: File[] = [];
  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  tags: string[] = [];
  reviewers!: Member[];
  membersInvited: Subject<void> = new Subject<void>();
  savedAttachments: Attachment[] = [];
  deletedAttachments : Attachment[] =  [];

  constructor(private dealService: DealService,
              private router: Router,
              public fb: FormBuilder,
              private dialog: NgbModal,
              private scroller: ViewportScroller,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private activatedRoute: ActivatedRoute,
              private sessionStorageService: SessionStorageService,
              private authService: AuthService, private workspaceService: WorkspaceService) {

    const encodedInviteCode = this.activatedRoute.snapshot.paramMap.get('encodedInviteCode');
    if(!!encodedInviteCode) {
      if(authService.isLoggedIn) {
        dealService.getInvitedDeal(encodedInviteCode).subscribe((response) => {
          this.selectedDeal = response;
          workspaceService.getById(response.idOfWorkspace!).subscribe((response) => {
            this.selectedWorkspace = response;
            this.getLinkedDeliverables();
            this.getAttachments();
            this.patchForm();
            //router.navigate(['editDeal'], {state: {selectedDeal: deal, selectedWorkspace: response}})
          })
        });
      } else {
        sessionStorageService.store('invitedDeal', encodedInviteCode);
        router.navigate(['login'])
      }
    } else {
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((event) => {
          const navigation = this.router.getCurrentNavigation();
          this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
          this.selectedDeal = navigation?.extras.state ? navigation.extras.state?.['selectedDeal'] : undefined;
          this.getReviwers();
          if(!!this.selectedDeal) {
            this.getLinkedDeliverables();
            this.getAttachments();
            this.patchForm();
          }
        });
    }
  }

  getReviwers() {
    this.workspaceService.getMembersByType(this.selectedWorkspace.id!, MEMBER_TYPES.REVIEWER).subscribe((response) => {
      this.reviewers = response;
    })
  }

  dealForm = this.fb.group({
    status: [''],
    summary: [''],
    description: ['', Validators.required],
    price: [0, Validators.required],
    notification: [false],
    startedAt: ['', Validators.required],
    expiredAt: ['', Validators.required],
    tag: [undefined],
    tagsAsList: [['']],
    reviewerId: [0, Validators.required]
  })


  updateWorkflow(workspace: Workspace) {
    // this.selectedWorkspace = workspace;
  }

  getLinkedDeliverables() {
    this.dealService.getLinkedDeliverables(this.selectedWorkspace.id!, this.selectedDeal.id!).subscribe((response) => {
      this.deliverables = response;
    });
  }

  addAttachment($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files) {
      const fileList: FileList = target.files;
      console.log(fileList);
      this.attachments.push(...Array.from(fileList));
    }
  }

  private patchForm() {
    this.dealForm.patchValue({
      status: this.selectedDeal.status,
      description: this.selectedDeal.description,
      price: this.selectedDeal.price as number,
      summary: this.selectedDeal.summary,
      notification: this.selectedDeal.notification,
      startedAt: this.selectedDeal.startedAt,
      expiredAt: this.selectedDeal.expiredAt,
      tagsAsList: this.selectedDeal.tagsAsList,
      reviewerId: this.selectedDeal.reviewerId
    })
    this.tags = !!this.selectedDeal.tagsAsList ? this.selectedDeal.tagsAsList : [];
  }

  update() {
    const finalDeal = {...this.selectedDeal, ...this.dealForm.value}
    this.dealService.update(this.selectedWorkspace.id!, this.selectedDeal.id!, finalDeal).subscribe((response) => {
      if(!!response) {
        if(this.attachments.length > 0) {
          this.attachments.forEach((attachment) => {
            const formData = new FormData();
            formData.append('file', attachment, attachment.name);
            this.dealService.uploadAttachment(this.selectedWorkspace.id!, response.id!, formData).subscribe((response) => {
              // this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
            });
          });
          this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
        }
        if(this.deletedAttachments.length > 0) {
          this.deletedAttachments.forEach((attachment) => {
            this.dealService.deleteAttachment(this.selectedWorkspace.id!, response.id!, attachment.id!).subscribe((deleteResponse) => {
              // do nothing
            });
          });
          this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
        }
        else {
          this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
        }
      }
    });
  }

  delete() {
    const modalRef = this.dialog.open(DeleteDealComponent);
    modalRef.componentInstance.deal = this.selectedDeal;
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if(result.deleted) {
        this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
      }
    })
  }

  getNextStatus(currentStatus: string) {
    if(currentStatus === 'Draft') {
      return [{id: 'Active', name: 'Active'}];
    } else if(currentStatus === 'Active') {
      return [{id: 'Expired', name: 'Expired'}];
    }
    return [];
  }

  updateStatus(status: string) {
    this.selectedDeal.status = status;
    this.dealService.updateStatus(this.selectedWorkspace.id!, this.selectedDeal.id!, status).subscribe((response) => {
      if(!!response) {
        this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
      }
    });
  }

  goto() {
    console.log('------------------------');
    // this.router.navigate([], { fragment: "linked-deliverables" });
    /*document.getElementById("linked-deliverables")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });*/
    this.scroller.scrollToAnchor("linked-deliverables");
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.dealForm.patchValue({startedAt: this.formatter.format(this.fromDate)})
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.dealForm.patchValue({expiredAt: this.formatter.format(this.toDate)})
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.dealForm.patchValue({startedAt: this.formatter.format(this.fromDate)})
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue = this.dealForm.controls.tag.value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space' || event.code === 'Enter') {
        this.addTag(inputValue!);
        this.dealForm.controls.tag.setValue(undefined);
      }
    }
  }

  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
  }

  inviteMembers() {
    const modalRef = this.dialog.open(InviteWorkspaceMembersComponent);
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if (result.membersInvited) {
        this.membersInvited.next();
        this.getReviwers();
      }
    })
  }

  removeAttachment(attachment: File) {
    const index: number = this.attachments.indexOf(attachment);
    this.attachments.splice(index, 1);
  }

  private getAttachments() {
    this.dealService.getAttachments(this.selectedWorkspace.id!, this.selectedDeal.id!).subscribe((response) => {
      this.savedAttachments = response;
    })
  }

  removeSaveAttachment(attachment: Attachment) {
    const index: number = this.savedAttachments.indexOf(attachment);
    this.savedAttachments.splice(index, 1);
    this.deletedAttachments.push(attachment);
  }
}
