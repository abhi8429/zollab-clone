import {Component, ElementRef, HostListener, Renderer2} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {Member, MEMBER_TYPES} from "../../../model/member";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ɵTypedOrUntyped} from "@angular/forms";
import {DealService} from "../../../services/deal.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {WorkspaceService} from "../../../services/workspace.service";
import {DeliverableService} from "../../../services/deliverable.service";
import {filter, Observable, Subject} from "rxjs";
import {Deliverable, DeliverableForm, DraftPost} from "../../../model/deliverable";
import {NgbDateAdapter, NgbDateParserFormatter, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChangesNeededComponent} from "../../../modals/changes-needed/changes-needed.component";
import {
  InviteWorkspaceMembersComponent
} from "../../../modals/invite-workspace-members/invite-workspace-members.component";
import {AuthService} from "../../../auth/auth.service";
import {SessionStorageService} from "ngx-webstorage";
import {DeleteDeliverableComponent} from "../../../modals/delete-deliverable/delete-deliverable.component";
import {CustomDateAdapter, CustomDateParserFormatter} from "../create-deliverable/create-deliverable.component";
import {Deal} from "../../../model/deal";
import {LivePost} from "../../../model/live-post";
import {ReportComponent} from "../../../modals/report/report.component";
import {FilePreviewComponent} from "../../../modals/file-preview/file-preview.component";
import {random} from "lodash-es";
import {ComponentCanDeactivate} from "../../../auth/pending-changes-guard.guard";

@Component({
  selector: 'app-edit-deliverable',
  templateUrl: './edit-deliverable.component.html',
  styleUrls: ['./edit-deliverable.component.css'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomDateAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class EditDeliverableComponent implements ComponentCanDeactivate {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.deliverableForm.dirty) {
      return false;
      // return confirm('Are you sure you want to navigate away and lose changes to the form?');
    }
    return true;
  }

  selectedWorkspace!: Workspace;
  selectedDeliverable!: Deliverable;
  members!: Member[];
  hideLeftMenu: boolean = true;
  creators!: Member[];
  private suggestedChanges: string | undefined;
  membersInvited: Subject<void> = new Subject<void>();
  repeatType = 'Never';
  submitted = false;
  public minDate: { month: number; year: number; day: number };
  deal!: Deal;
  livePosts: LivePost[] = [];
  draftPosts: DraftPost[] = [];
  private deletedLivePosts: LivePost[] = [];
  private deletedDraftPosts: DraftPost[] = [];
  private draftPostFiles: File[] = [];

  constructor(public fb: FormBuilder,
              private dealService: DealService,
              private router: Router,
              private workspaceService: WorkspaceService,
              private deliverableService: DeliverableService,
              private dialog: NgbModal,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private sessionStorageService: SessionStorageService,
              private renderer: Renderer2,
              private el: ElementRef) {
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    const encodedInviteCode = this.activatedRoute.snapshot.paramMap.get('encodedInviteCode');
    if (!!encodedInviteCode) {
      if (authService.isLoggedIn) {
        deliverableService.getInvitedDeliverable(encodedInviteCode).subscribe((response) => {
          this.selectedDeliverable = response;
          workspaceService.getById(response.idOfWorkspace!).subscribe((response) => {
            this.selectedWorkspace = response;
            this.getCreators();
            this.patchForm();
            this.getLivePosts();
            this.getDraftPosts();
            //router.navigate(['editDeal'], {state: {selectedDeal: deal, selectedWorkspace: response}})
          })
        });
      } else {
        sessionStorageService.store('invitedDeliverable', encodedInviteCode);
        router.navigate(['login'])
      }
    } else {
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((event) => {
          const navigation = this.router.getCurrentNavigation();
          this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
          this.selectedDeliverable = navigation?.extras.state ? navigation.extras.state?.['selectedDeliverable'] : undefined;
          this.getCreators();
          if (!!this.selectedDeliverable) {
            this.getDeal();
            this.getLivePosts();
            this.getDraftPosts();
            this.patchForm();
          }
        });
    }
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
      date: new FormControl('', {nonNullable: true}),
      schEndsDate: new FormControl(null, {nonNullable: false}),
      monthDay: new FormControl('', {nonNullable: false}),
      day: new FormControl(null, {nonNullable: false}),
      schEndsOccurences: new FormControl(0)
    })
  })

  private patchForm() {
    this.deliverableForm.patchValue({
      description: this.selectedDeliverable.description,
      priority: this.selectedDeliverable.priority,
      summary: this.selectedDeliverable.summary,
      creatorId: this.selectedDeliverable.creatorId,
      reviewerRequired: this.selectedDeliverable.reviewerRequired,
    });
    if (!!this.selectedDeliverable.repeatConf) {
      this.deliverableForm.patchValue({
        repeatConf: {
          schType: this.selectedDeliverable.repeatConf?.schType,
          timeZone: this.selectedDeliverable.repeatConf?.timeZone,
          timeHrs: this.selectedDeliverable.repeatConf?.timeHrs,
          timeMins: this.selectedDeliverable.repeatConf?.timeMins,
          timeSecs: this.selectedDeliverable.repeatConf?.timeSecs,
          schEndsType: this.selectedDeliverable.repeatConf?.schEndsType,
          date: this.selectedDeliverable.repeatConf?.date,
          schEndsDate: this.selectedDeliverable.repeatConf?.schEndsDate,
          monthDay: this.selectedDeliverable.repeatConf?.monthDay,
          day: this.selectedDeliverable.repeatConf?.day,
          schEndsOccurences: this.selectedDeliverable.repeatConf?.schEndsOccurences,
        }
      })
    } else {
      this.deliverableForm.patchValue({
        repeatConf: {
          schType: 'Never'
        }
      })
    }

    this.repeatType = !!this.selectedDeliverable.repeatConf ? this.selectedDeliverable.repeatConf.schType! : 'Never';
  }

  updateWorkspace(workspace: Workspace) {
    this.selectedWorkspace = workspace;
  }

  getNextStatus(currentStatus: string) {
    if (currentStatus === 'NOT_STARTED') {
      return [{id: 'in-progress', name: 'Start'}];
    } else if (currentStatus === 'IN_PROGRESS') {
      return [{id: 'in-review', name: 'Send For Review'}];
    } else if (currentStatus === 'IN_REVIEW') {
      return [{id: 'approved', name: 'Approve'}, {id: 'rejected', name: 'Reject'}, {
        id: 'changes-needed',
        name: 'Changes needed'
      }];
    } else if (currentStatus === 'CHANGES_NEEDED') {
      return [{id: 'in-review', name: 'Send For Review'}, {id: 'in-progress', name: 'Start'}];
    }
    return [];
  }

  updateStatus(nxtStatus: string) {
    if (nxtStatus === 'changes-needed' && this.suggestedChanges === undefined) {
      this.openChangesNeededModal();
      return;
    }
    this.deliverableService.updateStatus(this.selectedWorkspace.id!, this.selectedDeliverable.idOfDeal!,
      this.selectedDeliverable.id!, nxtStatus, {changedRequestedReason: this.suggestedChanges}).subscribe((response) => {
      if (!!response) {
        this.selectedDeliverable = response;
      }
    })
  }

  openChangesNeededModal() {
    this.dialog.open(ChangesNeededComponent).result.then((response) => {
      this.suggestedChanges = response.suggestedChanges;
      this.updateStatus('changes-needed');
    });
  }

  getCreators() {
    this.workspaceService.getMembersByType(this.selectedWorkspace.id!, MEMBER_TYPES.CREATORS).subscribe((response) => {
      this.creators = response;
    })
  }

  inviteMembers() {
    const modalRef = this.dialog.open(InviteWorkspaceMembersComponent);
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if (result.membersInvited) {
        this.membersInvited.next();
        this.getCreators();
      }
    })
  }

  updateDeliverable() {
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
    const finalDeliverable = {...this.selectedDeliverable, ...this.deliverableForm.value}
    this.deliverableService.update(this.selectedWorkspace.id!, this.selectedDeliverable.idOfDeal!,
      this.selectedDeliverable.id!, finalDeliverable).subscribe((response) => {
      if (!!response) {
        // delete the deleted posts
        if (this.deletedLivePosts.length > 0) {
          this.deletedLivePosts.forEach((livePost) => {
            this.deliverableService.deleteLivePost(this.selectedWorkspace.id!, this.deal.id!, response.id!, livePost.id!).subscribe((deleteResponse) => {
              // do nothing
            });
          })
        }
        if (this.deletedDraftPosts.length > 0) {
          this.deletedDraftPosts.forEach((draftPost) => {
            this.deliverableService.deleteDraftPost(this.selectedWorkspace.id!, this.deal.id!, response.id!, draftPost.id!).subscribe((deleteResponse) => {
              // do nothing
            });
          })
        }
        const livePosts = this.getLocalLivePosts();
        if (livePosts.length > 0) {
          livePosts.forEach((livePost) => {
            const formData = new FormData();
            formData.append('url', livePost);
            this.deliverableService.addLivePost(this.selectedWorkspace.id!, this.deal.id!, response.id!, formData).subscribe((response) => {
              // Do Nothing
            });
          });
        }
        const draftLinkPosts = this.getLocalDraftPosts();
        if (draftLinkPosts.length > 0) {
          draftLinkPosts.forEach((draftLinkPost) => {
            const formData = new FormData();
            formData.append('url', draftLinkPost);
            this.deliverableService.addDraftPost(this.selectedWorkspace.id!, this.deal.id!, response.id!, formData).subscribe((response) => {
              // Do Nothing
            });
          });
        }
        if (this.draftPostFiles.length > 0) {
          this.draftPostFiles.forEach((draftFilePost) => {
            const formData = new FormData();
            formData.append('file', draftFilePost);
            this.deliverableService.addDraftPost(this.selectedWorkspace.id!, this.deal.id!, response.id!, formData).subscribe((response) => {
              // Do Nothing
            });
          });
        }

        this.router.navigate(['/deliverable'], {state: {selectedWorkspace: this.selectedWorkspace}});
      }
    });
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

  delete() {
    const modalRef = this.dialog.open(DeleteDeliverableComponent);
    modalRef.componentInstance.deliverable = this.selectedDeliverable;
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if (result.deleted) {
        this.router.navigate(['/deliverable'], {state: {selectedWorkspace: this.selectedWorkspace}})
      }
    })
  }

  get f(): ɵTypedOrUntyped<DeliverableForm, DeliverableForm, { [p: string]: AbstractControl<any> }> {
    return this.deliverableForm.controls;
  }

  private getDeal() {
    this.dealService.getById(this.selectedWorkspace.id!, this.selectedDeliverable.idOfDeal!).subscribe(response => {
      this.deal = response;
    });
  }

  getLivePosts() {
    this.deliverableService.getLivePosts(this.selectedWorkspace.id!, this.selectedDeliverable.idOfDeal!,
      this.selectedDeliverable.id!).subscribe((response) => {
      this.livePosts = response;
    })
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

  deleteLivePost(livePost: LivePost) {
    this.deletedLivePosts.push(livePost);
    const index: number = this.livePosts.indexOf(livePost);
    this.livePosts.splice(index, 1);
  }

  private getLocalLivePosts() {
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

  generateReport() {
    this.deliverableService.generateReport(this.selectedWorkspace.id!, this.deal.id!, this.selectedDeliverable.id!).subscribe((report) => {
      console.log(this.selectedDeliverable.creatorObj);
      if (!!report) {
        report.contents?.forEach(async (content) => {
          content.displayImage = this.deliverableService.resolveCorsProxy(encodeURIComponent(content.thumbnail_url!));
        })
      }
      const modalRef = this.dialog.open(ReportComponent);
      modalRef.componentInstance.report = report;
      modalRef.componentInstance.workspaceId = this.selectedWorkspace.id;
      modalRef.componentInstance.dealId = this.selectedDeliverable.idOfDeal;
      modalRef.componentInstance.deliverableId = this.selectedDeliverable.id;
      modalRef.componentInstance.creator = this.selectedDeliverable.creatorObj;

    })
  }

  /*addDraftLinks() {
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
    const container = this.el.nativeElement.querySelector('#draftLinksContainer');
    this.renderer.appendChild(container, div);
    /!*if(target.value) {
      const fileList: string = target.value;
      console.log(fileList);
      this.livePosts.push(fileList);
      console.log('----------------------', this.livePosts);
      target.value = '';
    }*!/
  }*/


  getDraftPosts() {
    this.deliverableService.getDraftPosts(this.selectedWorkspace.id!, this.selectedDeliverable.idOfDeal!,
      this.selectedDeliverable.id!).subscribe((response) => {
      this.draftPosts = response;
    })
  }

  deleteDraftPost(draftPost: DraftPost) {
    this.deletedDraftPosts.push(draftPost);
    const index: number = this.draftPosts.indexOf(draftPost);
    this.draftPosts.splice(index, 1);
  }

  private getLocalDraftPosts() {
    const draftPosts: string[] = [];
    const container: HTMLDivElement = this.el.nativeElement.querySelector('#draftLinksContainer');
    const coll: HTMLCollection = container.children;
    Array.from(coll).forEach((child) => {
      const draftPost: string = (child.children[0] as HTMLInputElement).value;
      console.log(draftPost);
      if (draftPost.trim().length > 0) {
        draftPosts.push((child.children[0] as HTMLInputElement).value)
      }
    });
    return draftPosts;
  }

  /*addDraftFiles($event: any) {
    console.log($event.target.files);
    const file: File = $event.target.files[0];
    this.draftPostFiles.push(file);
    let image = URL.createObjectURL($event.target.files[0]);
    if (!file.type.includes('image') && !file.type.includes('video')) {
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
    this.renderer.appendChild(fileDiv, fileImg);
    this.renderer.appendChild(div, fileDiv);
    const dustbinAnchor = this.renderer.createElement('a');
    this.renderer.listen(dustbinAnchor, 'click', (event) => {
      this.renderer.removeChild(container, div);
      const index: number = this.draftPostFiles.indexOf(file);
      console.log(index);
      this.draftPostFiles.splice(index, 1);
    })
    const dustbin = this.renderer.createElement('img');
    this.renderer.setProperty(dustbin, 'src', 'assets/img/dustbin.svg');
    this.renderer.appendChild(dustbinAnchor, dustbin);
    this.renderer.appendChild(div, dustbinAnchor);
    const container = this.el.nativeElement.querySelector('#draftFilesContainer');
    this.renderer.appendChild(container, div);
    /!*if(target.value) {
      const fileList: string = target.value;
      console.log(fileList);
      this.livePosts.push(fileList);
      console.log('----------------------', this.livePosts);
      target.value = '';
    }*!/
  }*/

  previewDraftFile(file: File) {
    const modalRef = this.dialog.open(FilePreviewComponent);
    modalRef.componentInstance.file = file;
  }

  previewUploadedDraftFile(draftPost: DraftPost) {
    const modalRef = this.dialog.open(FilePreviewComponent);
    modalRef.componentInstance.post = draftPost;
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
}
