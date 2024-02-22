import {Component, ElementRef, HostListener, Injectable, Renderer2} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {DealService} from "../../../services/deal.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter, Observable, Subject} from "rxjs";
import {Deal} from "../../../model/deal";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ɵTypedOrUntyped} from "@angular/forms";
import {Member, MEMBER_TYPES} from "../../../model/member";
import {WorkspaceService} from "../../../services/workspace.service";
import {DeliverableService} from "../../../services/deliverable.service";
import {
  InviteWorkspaceMembersComponent
} from "../../../modals/invite-workspace-members/invite-workspace-members.component";
import {
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDateStruct,
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import {DeliverableForm} from "../../../model/deliverable";
import {FilePreviewComponent} from "../../../modals/file-preview/file-preview.component";
import {random} from "lodash-es";
import {ComponentCanDeactivate} from "../../../auth/pending-changes-guard.guard";


@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: this.getMonthNumber(date[1]),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    // return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
    return date ? `${date.day.toString().padStart(2, '0')}-${this.getMonthName(date.month)}-${date.year}` : null;
    // return date ? date.day + this.DELIMITER + this.getMonthName(date.month) + this.DELIMITER + date.year : null;
  }

  private getMonthName(month: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }

  private getMonthNumber(monthName: string): number {
    const months = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    const monthIndex = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    return monthIndex + 1;
  }
}


@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  format(date: NgbDateStruct): string {
    if (date === null) {
      return '';
    }
    return `${date.day.toString().padStart(2, '0')}-${this.getMonthName(date.month)}-${date.year}`;
  }

  parse(value: string): NgbDateStruct | null {
    if (!value) {
      return null;
    }
    const parts = value.trim().split('-');
    if (parts.length !== 3) {
      return null;
    }
    const day = parseInt(parts[0], 10);
    const month = this.getMonthNumber(parts[1]);
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }
    return {year, month, day};
  }

  private getMonthNumber(monthName: string): number {
    const months = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    const monthIndex = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    return monthIndex + 1;
  }

  private getMonthName(month: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }
}

@Component({
  selector: 'app-create-deliverable',
  templateUrl: './create-deliverable.component.html',
  styleUrls: ['./create-deliverable.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomDateAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class CreateDeliverableComponent implements ComponentCanDeactivate {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.deliverableForm.dirty) {
      return false;
      // return confirm('Are you sure you want to navigate away and lose changes to the form?');
    }
    return true;
  }

  selectedWorkspace!: Workspace;
  hideLeftMenu: boolean = true;
  selectedDeal!: Deal;
  deals!: Deal[];
  creators!: Member[];
  reviewers!: Member[];
  evidences: File[] = [];
  membersInvited: Subject<void> = new Subject<void>();
  repeatType = 'Never';
  submitted = false;
  public today = new Date();
  public minDate: { month: number; year: number; day: number };
  draftPostFiles: File[] = [];

  constructor(public fb: FormBuilder,
              private dealService: DealService,
              private router: Router,
              private workspaceService: WorkspaceService,
              private deliverableService: DeliverableService,
              private dialog: NgbModal,
              public formatter: NgbDateParserFormatter,
              private config: NgbDatepickerConfig,
              private renderer: Renderer2,
              private el: ElementRef) {
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.selectedDeal = navigation?.extras.state ? navigation.extras.state?.['selectedDeal'] : undefined;
        if (this.selectedDeal) {
          this.deliverableForm.controls.repeatConf?.controls?.['schEndsDate'].setValue(this.selectedDeal.expiredAt);
        }
        this.getCreators();
        this.getAllDeals();
        this.getReviewers();
      });
  }

  deliverableForm = new FormGroup<DeliverableForm>({
    summary: new FormControl('', {nonNullable: true, validators: Validators.required}),
    description: new FormControl('', {nonNullable: true, validators: Validators.required}),
    creatorId: new FormControl(0, {nonNullable: true, validators: Validators.required}),
    dealId: new FormControl(0, {nonNullable: true, validators: Validators.required}),
    priority: new FormControl('', {nonNullable: true, validators: Validators.required}),
    reviewerRequired: new FormControl(false, {nonNullable: true}),
    repeatConf: new FormGroup<any>({
      schType: new FormControl('Never', {nonNullable: true}),
      timeZone: new FormControl('IST', {nonNullable: true}),
      timeHrs: new FormControl('00', {nonNullable: true}),
      timeMins: new FormControl('01', {nonNullable: true}),
      timeSecs: new FormControl('01', {nonNullable: true}),
      schEndsType: new FormControl('never', {nonNullable: true}),
      date: new FormControl(null, {nonNullable: false}),
      schEndsDate: new FormControl(null, {nonNullable: false}),
      monthDay: new FormControl('', {nonNullable: false}),
      day: new FormControl('', {nonNullable: false}),
      schEndsOccurences: new FormControl(0)
    })
  })

  /*deliverableForm = this.fb.group({
    summary: ['', [Validators.required]],
    description: ['', Validators.required],
    price: ['', Validators.required],
    creatorId: ['', Validators.required],
    dealId: [0, Validators.required],
    priority: ['', Validators.required],
    reviewerId: ['', Validators.required],
    repeatConf : this.fb.group({
      schType : ['Never'],
      timeZone:['IST'],
      timeHrs: ['00'],
      timeMins: ['00'],
      timeSecs: ['00'],
      schEndsType: ['never'],
      date:['']
    })
  })*/

  getCreators() {
    this.workspaceService.getMembersByType(this.selectedWorkspace.id!, MEMBER_TYPES.CREATORS).subscribe((response) => {
      this.creators = response;
    })
  }

  getReviewers() {
    this.workspaceService.getMembersByType(this.selectedWorkspace.id!, MEMBER_TYPES.REVIEWER).subscribe((response) => {
      this.reviewers = response;
    })
  }

  updateWorkspace(workspace: Workspace) {
    this.selectedWorkspace = workspace;
  }

  create() {
    this.submitted = true;
    if (this.deliverableForm.invalid) {
      return;
    }
    if (this.repeatType === 'Never') {
      this.deliverableForm.removeControl('repeatConf');
      // this.deliverableForm.updateValueAdValidity();
    }
    if (this.deliverableForm.controls.repeatConf?.controls?.['schEndsType'].value === 'never') {
      this.deliverableForm.controls.repeatConf?.controls?.['schEndsOccurences'].setValue(null);
      this.deliverableForm.controls.repeatConf?.controls?.['schEndsDate'].setValue(null);
    } else if (this.deliverableForm.controls.repeatConf?.controls?.['schEndsType'].value === 'on') {
      this.deliverableForm.controls.repeatConf?.controls?.['schEndsOccurences'].setValue(null);
    } else if (this.deliverableForm.controls.repeatConf?.controls?.['schEndsType'].value === 'after') {
      this.deliverableForm.controls.repeatConf?.controls?.['schEndsDate'].setValue(null);
    }

    this.deliverableService.create(this.selectedWorkspace.id!, this.deliverableForm.value.dealId!, this.deliverableForm.value).subscribe((response) => {
      if (!!response) {
        const livePosts = this.getLivePosts();
        if (livePosts.length > 0) {
          livePosts.forEach((livePost) => {
            const formData = new FormData();
            formData.append('url', livePost);
            this.deliverableService.addLivePost(this.selectedWorkspace.id!, this.deliverableForm.value.dealId!, response.id!, formData).subscribe((response) => {
              // Do Nothing
            });
          });
          if (!!this.selectedDeal) {
            this.router.navigate(['/editDeal'], {
              state: {
                selectedDeal: this.selectedDeal,
                selectedWorkspace: this.selectedWorkspace
              }, fragment: 'linked-deliverables'
            })
          } else {
            this.router.navigate(['/deliverable'], {state: {selectedWorkspace: this.selectedWorkspace}})
          }
        }

        const draftLinkPosts = this.getDraftLinks();
        if (draftLinkPosts.length > 0) {
          draftLinkPosts.forEach((draftLinkPost) => {
            const formData = new FormData();
            formData.append('url', draftLinkPost);
            this.deliverableService.addDraftPost(this.selectedWorkspace.id!, this.deliverableForm.value.dealId!, response.id!, formData).subscribe((response) => {
              // Do Nothing
            });
          });
          if (!!this.selectedDeal) {
            this.router.navigate(['/editDeal'], {
              state: {
                selectedDeal: this.selectedDeal,
                selectedWorkspace: this.selectedWorkspace
              }, fragment: 'linked-deliverables'
            })
          } else {
            this.router.navigate(['/deliverable'], {state: {selectedWorkspace: this.selectedWorkspace}})
          }
        }

        if (this.draftPostFiles.length > 0) {
          this.draftPostFiles.forEach((draftFilesPost) => {
            const formData = new FormData();
            formData.append('file', draftFilesPost);
            this.deliverableService.addDraftPost(this.selectedWorkspace.id!, this.deliverableForm.value.dealId!, response.id!, formData).subscribe((response) => {
              // Do Nothing
            });
          });
          if (!!this.selectedDeal) {
            this.router.navigate(['/editDeal'], {
              state: {
                selectedDeal: this.selectedDeal,
                selectedWorkspace: this.selectedWorkspace
              }, fragment: 'linked-deliverables'
            })
          } else {
            this.router.navigate(['/deliverable'], {state: {selectedWorkspace: this.selectedWorkspace}})
          }
        } else {
          if (!!this.selectedDeal) {
            this.router.navigate(['/editDeal'], {
              state: {
                selectedDeal: this.selectedDeal,
                selectedWorkspace: this.selectedWorkspace
              }, fragment: 'linked-deliverables'
            })
          } else {
            this.router.navigate(['/deliverable'], {state: {selectedWorkspace: this.selectedWorkspace}})
          }
        }
      }
    })
  }

  addEvidence($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (target.files) {
      const fileList: FileList = target.files;
      console.log(fileList);
      this.evidences.push(...Array.from(fileList));
      console.log('----------------------', this.evidences);
    }
  }

  deleteEvidence(evidence: File) {
    const index: number = this.evidences.indexOf(evidence);
    this.evidences.splice(index, 1);
  }

  getAllDeals() {
    this.dealService.getAll(this.selectedWorkspace.id!).subscribe((response) => {
      this.deals = response;
    });
  }

  inviteMembers() {
    const modalRef = this.dialog.open(InviteWorkspaceMembersComponent);
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if (result.membersInvited) {
        this.membersInvited.next();
        this.getCreators();
        this.getReviewers();
      }
    })
  }

  onDateSelection(date: NgbDate) {
    this.deliverableForm.patchValue({
      repeatConf: {
        date: this.formatter.format(date)
      }
    })

  }

  selectRepeat(event: any) {
    const value = event.target.value;
    console.log(value);
    this.repeatType = value;
    if (value === 'Once') {
      this.deliverableForm.controls.repeatConf?.controls['date']?.setValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.controls['day']?.removeValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.controls['monthDay']?.removeValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.updateValueAndValidity();
    } else if (value === 'Weekly') {
      this.deliverableForm.controls.repeatConf?.controls['date']?.removeValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.controls['monthDay']?.removeValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.controls['day']?.setValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.updateValueAndValidity();
    } else if (value === 'Monthy') {
      this.deliverableForm.controls.repeatConf?.controls['date']?.removeValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.controls['day']?.removeValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.controls['monthDay']?.setValidators(Validators.required);
      this.deliverableForm.controls.repeatConf?.updateValueAndValidity();
    }
    /* this.deliverableForm.patchValue({
       repeatConf: {
         schType: value
       }
     })*/
  }


  addLivePost() {
    const div: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(div, 'deliverable-edit-not-started-evidences-row');
    const input: HTMLInputElement = this.renderer.createElement('input');
    this.renderer.addClass(input, 'form-control');
    this.renderer.appendChild(div, input);
    const dustbinAnchor = this.renderer.createElement('a');
    this.renderer.listen(dustbinAnchor, 'click', (event) => {
      this.renderer.removeChild(container, div);
    })
    const dustbin = this.renderer.createElement('img');
    this.renderer.setProperty(dustbin, 'src', 'assets/img/dustbin.svg');
    this.renderer.appendChild(dustbinAnchor, dustbin);
    this.renderer.appendChild(div, dustbinAnchor);
    const container = this.el.nativeElement.querySelector('#livePostsContainer');
    this.renderer.appendChild(container, div);
    /*if(target.value) {
      const fileList: string = target.value;
      console.log(fileList);
      this.livePosts.push(fileList);
      console.log('----------------------', this.livePosts);
      target.value = '';
    }*/
  }

  get f(): ɵTypedOrUntyped<DeliverableForm, DeliverableForm, { [p: string]: AbstractControl<any> }> {
    return this.deliverableForm.controls;
  }

  onDealSelection(event: any) {
    const sDeal: Deal | undefined = this.deals.find((deal) => deal.id + '' === event.target.value);
    this.deliverableForm.controls.repeatConf?.controls?.['schEndsDate'].setValue(sDeal?.expiredAt);
  }

  private getLivePosts() {
    const livePosts: string[] = [];
    const container: HTMLDivElement = this.el.nativeElement.querySelector('#livePostsContainer');
    const coll: HTMLCollection = container.children;
    Array.from(coll).forEach((child) => {
      const livePost: string = (child.children[0] as HTMLInputElement).value;
      console.log(livePost);
      if (livePost.trim().length > 0) {
        livePosts.push((child.children[0] as HTMLInputElement).value)
      }
    });
    return livePosts;
  }

  addDraftLinks() {
    const randomId = random(100)
    const div: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(div, 'deliverable-edit-not-started-evidences-row');

    /**
     * Input field where the link can be added or attachment name will show.
     */

    const input: HTMLInputElement = this.renderer.createElement('input');
    input.setAttribute('id', 'draftInput' + randomId);
    this.renderer.addClass(input, 'form-control');
    this.renderer.appendChild(div, input);


    /**
     * Attachment icon for file upload.
     */

    const attachmentDiv: HTMLDivElement = this.renderer.createElement('div');
    const attachmentLabel: HTMLLabelElement = this.renderer.createElement('label');
    this.renderer.setAttribute(attachmentLabel, 'class', 'd-flex align-items-baseline w-100 justify-content-between');
    this.renderer.setAttribute(attachmentLabel, 'for', 'fileUpload' + randomId);
    this.renderer.appendChild(attachmentDiv, attachmentLabel);

    const attachmentAnchor = this.renderer.createElement('a');
    const attachmentImg = this.renderer.createElement('img');
    this.renderer.setProperty(attachmentImg, 'src', 'assets/img/attachment.svg');
    this.renderer.appendChild(attachmentAnchor, attachmentImg);
    this.renderer.appendChild(attachmentLabel, attachmentAnchor);

    /**
     * File input type
     */
    const attachmentInput: HTMLInputElement = this.renderer.createElement('input');
    this.renderer.addClass(attachmentInput, 'file-input')
    attachmentInput.setAttribute('id', 'fileUpload' + randomId);
    attachmentInput.setAttribute('type', 'file');

    /**
     * Hidden field to get the file later on delete.
     */

    const hiddenFileField = this.renderer.createElement('file');
    hiddenFileField.setAttribute('type', 'hidden');
    hiddenFileField.setAttribute('id', 'hidden' + randomId);
    this.renderer.appendChild(attachmentDiv, hiddenFileField);

    /**
     * Event Listener for file uploads
     */

    this.renderer.listen(attachmentInput, 'change', (event) => {
      this.addDraftFiles(event, input, hiddenFileField);
    });
    this.renderer.appendChild(attachmentDiv, attachmentInput);
    this.renderer.appendChild(div, attachmentDiv);

    /**
     * Delete button for the row, if the row contains file which is there in hidden element
     * remove it from the array holding all the attachments.
     */
    const dustbinAnchor = this.renderer.createElement('a');
    this.renderer.listen(dustbinAnchor, 'click', (event) => {
      this.renderer.removeChild(container, div);
      const file = hiddenFileField.value;
      if (!!file) {
        const index: number = this.draftPostFiles.indexOf(file);
        this.draftPostFiles.splice(index, 1);
      }
    })
    const dustbin = this.renderer.createElement('img');
    this.renderer.setProperty(dustbin, 'src', 'assets/img/dustbin.svg');
    this.renderer.appendChild(dustbinAnchor, dustbin);
    this.renderer.appendChild(div, dustbinAnchor);

    /**
     * Finally add everything to the main container.
     */
    const container = this.el.nativeElement.querySelector('#draftLinksContainer');
    this.renderer.appendChild(container, div);
    /*if(target.value) {
      const fileList: string = target.value;
      console.log(fileList);
      this.livePosts.push(fileList);
      console.log('----------------------', this.livePosts);
      target.value = '';
    }*/
  }


  private getDraftLinks() {
    const draftLinks: string[] = [];
    const container: HTMLDivElement = this.el.nativeElement.querySelector('#draftLinksContainer');
    const coll: HTMLCollection = container.children;
    Array.from(coll).forEach((child) => {
      const draftLink: string = (child.children[0] as HTMLInputElement).value;
      console.log('field', child.children[0]);
      if (draftLink.trim().length > 0 && !child.children[0].hasAttribute('readonly')) {
        draftLinks.push(draftLink.trim())
      }
    });
    return draftLinks;
  }

  addDraftFiles($event: any, input: HTMLInputElement, hidden: HTMLElement) {
    console.log($event.target.files);
    const file: File = $event.target.files[0];
    this.draftPostFiles.push(file);
    input.value = file.name;
    this.renderer.setAttribute(input, 'readonly', 'true');
    this.renderer.setProperty(hidden, 'value', file);
    this.renderer.listen(input, 'click', (event) => {
      this.previewDraftFile(file);
    })
    /*let image = URL.createObjectURL($event.target.files[0]);
    if(!file.type.includes('image') && !file.type.includes('video')) {
      image = '/assets/img/doc_icon.png';
    }
    const div: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(div, 'deliverable-edit-not-started-evidences-row');
    const fileDiv: HTMLInputElement = this.renderer.createElement('div');
    this.renderer.addClass(fileDiv, 'add-video');
    this.renderer.setAttribute(fileDiv, 'video', 'video');
    this.renderer.listen(fileDiv, 'click', (event) => {
      this.previewDraftFile(file);
    })
    const fileImg = this.renderer.createElement('img');
    this.renderer.setProperty(fileImg, 'src', image);
    this.renderer.appendChild(fileDiv,fileImg);
    this.renderer.appendChild(div,fileDiv);
    const dustbinAnchor = this.renderer.createElement('a');
    this.renderer.listen(dustbinAnchor, 'click', (event) => {
      this.renderer.removeChild(container, div);
      const index: number = this.draftPostFiles.indexOf(file);
      this.draftPostFiles.splice(index, 1);
    })
    const dustbin = this.renderer.createElement('img');
    this.renderer.setProperty(dustbin, 'src', 'assets/img/dustbin.svg');
    this.renderer.appendChild(dustbinAnchor, dustbin);
    this.renderer.appendChild(div, dustbinAnchor);
    const container = this.el.nativeElement.querySelector('#draftFilesContainer');
    this.renderer.appendChild(container, div);*/
    /*if(target.value) {
      const fileList: string = target.value;
      console.log(fileList);
      this.livePosts.push(fileList);
      console.log('----------------------', this.livePosts);
      target.value = '';
    }*/
  }

  previewDraftFile(file: File) {
    console.log(file);
    const modalRef = this.dialog.open(FilePreviewComponent);
    modalRef.componentInstance.file = file;
  }
}
