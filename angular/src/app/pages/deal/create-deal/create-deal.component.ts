import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {DealService} from "../../../services/deal.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, Observable, Subject} from "rxjs";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {WorkspaceService} from "../../../services/workspace.service";
import {Member, MEMBER_TYPES} from "../../../model/member";
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {find, pull} from 'lodash-es';
import {
  InviteWorkspaceMembersComponent
} from "../../../modals/invite-workspace-members/invite-workspace-members.component";
import {ComponentCanDeactivate} from "../../../auth/pending-changes-guard.guard";

@Component({
  selector: 'app-create-deal',
  templateUrl: './create-deal.component.html',
  styleUrls: ['./create-deal.component.css']
})
export class CreateDealComponent implements ComponentCanDeactivate {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.dealForm.dirty) {
      return false;
      // return confirm('Are you sure you want to navigate away and lose changes to the form?');
    }
    return true;
  }
  workspaceSettings!: boolean;
  members!: Member[];
  attachments: File[] = [];
  selectedWorkspace!: Workspace;
  hideLeftMenu: boolean = true;
  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  tags: string[] = [];
  submitted = false;
  @ViewChild('tagInput') tagInputRef!: ElementRef;
  membersInvited: Subject<void> = new Subject<void>();

  constructor(public fb: FormBuilder,
              private dealService: DealService,
              private router: Router, private workspaceService: WorkspaceService,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private dialog: NgbModal) {
    this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((event) => {
          const navigation = this.router.getCurrentNavigation();
          this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
          this.getReviwers();
        });
  }

  dealForm = this.fb.group({
    summary: ['', [Validators.required]],
    description: ['', Validators.required],
    price: ['', Validators.required],
    notification: [false],
    startedAt: ['', Validators.required],
    expiredAt: ['', Validators.required],
    tag: [undefined],
    tagsAsList: [['']],
    reviewerId: ['', Validators.required],
  })

  create() {
    this.submitted = true;
    if (this.dealForm.invalid) {
      return;
    }
    this.dealForm.patchValue({
      tagsAsList: this.tags
    })
    this.dealService.create(this.selectedWorkspace.id!, this.dealForm.value).subscribe((response) => {
      if (!!response) {
        if (this.attachments.length > 0) {
          this.attachments.forEach((attachment) => {
            const formData = new FormData();
            formData.append('file', attachment, attachment.name);
            this.dealService.uploadAttachment(this.selectedWorkspace.id!, response.id!, formData).subscribe((attachmentResponse) => {
              this.router.navigate(['/createDeliverable'], {
                state: {
                  selectedWorkspace: this.selectedWorkspace,
                  selectedDeal: response
                }
              });
            });
          });
        } else {
          this.router.navigate(['/createDeliverable'], {
            state: {
              selectedWorkspace: this.selectedWorkspace,
              selectedDeal: response
            }
          });
        }
      }
    });
  }

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  addAttachment($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files) {
      const fileList: FileList = target.files;
      this.attachments.push(...Array.from(fileList));
    }
  }

  updateWorkflow(workspace: Workspace) {
    this.selectedWorkspace = workspace;
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
    console.log('--------', tag[tag.length - 1])
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

  get f(): { [key: string]: AbstractControl } {
    return this.dealForm.controls;
  }

  getReviwers() {
    this.workspaceService.getMembersByType(this.selectedWorkspace.id!, MEMBER_TYPES.REVIEWER).subscribe((response) => {
      this.members = response;
    })
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
}
