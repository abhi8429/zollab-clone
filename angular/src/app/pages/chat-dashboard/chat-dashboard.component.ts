import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import {ReviewApprovalComponent} from "../../modals/review-approval/review-approval.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DraftUploadComponent} from "../../modals/draft-upload/draft-upload.component";
import {SettingComponent} from "../../modals/setting/setting.component";
import {PaymentComponent} from "../../modals/payment/payment.component";
import {StatsComponent} from "../../modals/stats/stats.component";
import {ChatMessageService} from "../../services/chat-message.service";
import {TeamService} from "../../services/team.service";
import {ProjectService} from "../../services/project.service";
import {Chat, Content} from "../../model/chat";
import {ContentService} from "../../services/content.service";
import {startWith, Subscription, switchMap} from "rxjs";
import {interval} from "rxjs/internal/observable/interval";
import {ProjectDeliverableService} from "../../services/proiect.deliverable.service";
import {formatDate} from "@angular/common";
import {DeliverableListComponent} from "../../modals/deliverable-list/deliverable-list.component";
import {UploadDeliverableComponent} from "../../modals/upload-deliverable/upload-deliverable.component";
import {Deliverable} from "../../model/deliverable";
import {ZollabContent} from "../../model/zollab-content";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {RemoveFileComponent} from "../../modals/remove-file/remove-file.component";
import {CreateProjectDeliverableService} from "../../services/create-project-deliverable.service";
import {ProjectMember} from "../../model/project-member";
import { StarredMessagesComponent } from 'src/app/modals/starred-messages/starred-messages.component';
import { UserNotification } from 'src/app/model/user-notification';
import { UserNotificationService } from 'src/app/services/user-notification.service';
import {ProjectDeliverable} from "../../model/project-deliverable";
import { ImagePreviewDialogComponent } from 'src/app/modals/image-preview-dialog/image-preview-dialog.component';
import { Member } from '@sendbird/chat/groupChannel';
import { CreateTeamComponent } from 'src/app/modals/create-team/create-team.component';
import { ProfileComponent } from 'src/app/modals/profile/profile.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Team } from 'src/app/model/team';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css']
})
export class ChatDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollframe', {static: false}) scrollFrame?: ElementRef;
  // @ViewChild('#messageRef', {static: false}) messageRef?: ElementRef;
  @ViewChildren('item') itemElements?: QueryList<any>;
  private scrollContainer: any;

  timeInterval?: Subscription;
  visible: boolean = false;
  message = '';
  showEmojiPicker = false;
  chat?: Chat;
  deliverables: any[] = [];
  imageUrl: any = 'assets/img/profile-finger-icon.webp';
  readonly AVATAR_BASE_URL;

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 5;
  isNearBottom = true;
  firstTime = true;
  startPage: number;
  paginationLimit: number;
  emojiMessage = '';
  showEmojiPickerNew:boolean = false;
  // showDeliverableMessage:boolean=false;
  // private timeOutId:any;
  showDeliverableMessage?:boolean;

  private route = inject(ActivatedRoute);
  private routeSubscription!: Subscription;
  projectMembers: any = [] as ProjectMember;
  index: any;
  chatContent: any;
  deliverable: any;
  projectPermission: any = [];
  showSearchIcon: boolean = true;
  userId?: number;
  showDiv: boolean = false;
  filteredMembers: any[] = [];

  constructor(private dialog: NgbModal,
              private chatService: ChatMessageService,
              public teamService: TeamService,
              private contentService: ContentService,private router: Router,
              public projectService: ProjectService,private cdr: ChangeDetectorRef,
              private deliverableService: ProjectDeliverableService,private renderer: Renderer2,
              private createProjectDeliverableService: CreateProjectDeliverableService,private localStorageService: LocalStorageService,
              private notificationService: UserNotificationService, private authService: AuthService) {

    this.chatDataInit();
    this.loadProjectDeliverables();
    this.AVATAR_BASE_URL = contentService.getAvatarURL();
    this.startPage = 0;
    this.paginationLimit = 2;
  }
  messageId:any=''
  ngOnInit(): void {
    this.userId = this.localStorageService.retrieve('user').id;
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.messageId = params['messageId'];
      if (this.messageId) {
        this.loadChatOnRedirected(this.messageId);
        this.removeMessageIdFromUrl(this.messageId);
      }
      else{
        //commenting to test purpose currently
        this.pollMessageInitially()
      }
    });
    this.getProjectMembers();
    this.loadNotifications();
    this.getProjectPermission();
    this.getTeamPermission();
  }

  pollMessageInitially() {
    this.timeInterval = interval(6000).pipe(
      startWith(0),
      switchMap(() => {
        let messageCount = this.chat?.content?.length;
        if (messageCount === 0 || messageCount === undefined) {
          return this.chatService.getAll(this.teamService.selectedTeam.id!,
            this.projectService.selectedProject.id!);
        } else {
          let pivotId = this.chat?.content?.[messageCount! - 1].key?.id;
          console.log('pivotId', pivotId);
          return this.chatService.getDown(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, pivotId!)
        }
      }))
      .subscribe((chat) => {
        console.log('polling');
        if (!!chat?.content) {
          chat.content?.forEach((newContent) => {
            let index = this.chat?.content?.findIndex((content) => content.key.id === newContent.key.id);
            if (index === -1) {
              this.chat?.content?.push(newContent);
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.timeInterval?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.scrollContainer = this.scrollFrame?.nativeElement;
    this.itemElements?.changes.subscribe(_ => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  getFormatedDate(date: string) {
    return formatDate(date, 'dd/MM/yyyy', 'en-US');
  }

  loadProjectDeliverables() {
    this.deliverableService.getAll(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!)
      .subscribe((deliverables) => {
        this.deliverables = deliverables;
      })
  }

  chatDataInit() {
    this.chatService.getAll(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!)
      .subscribe((chat) => {
        this.chat = chat;
        if (!this.chat.content) {
          this.chat.content = [];
        }
      });
  }

  sendMessage(parentMessageId: string | null) {
    let teamId = this.teamService.selectedTeam.id;
    let projectId = this.projectService.selectedProject.id;
    this.showEmojiPickerNew=false;
    if (!!this.message.trim()) {
      let content: Content = {} as Content
      content.messageAsText = this.message.trim();
      content.key = {teamId, projectId, sentBy: this.teamService.userId};
      content.messageAsText = this.message.trim();
      if (this.parentMessageId) {
        content.metaData = {"parentMessageId":this.parentMessageId};
      }
      // if(this.replyToMesgClicked){
      //   content.messageAsText = this.addMessageForReply+" prev-msg: "+this.message.trim();//prev-msg-> added temporary need to add some predefined
      // }
      // else{
      //   content.messageAsText = this.message.trim();
      // }
      this.chatService.create(teamId!, projectId!, content).subscribe((chatContent) => {
        this.chat?.content?.push(chatContent);
        this.message = '';
        this.isNearBottom = true;
        this.replyToMesgClicked=false;
      });
    }
  }

  replyToMesgClicked:boolean=false;
  addMessageForReply="";
  openReplyOptionBox:boolean=false;
  parentMessageId:any='';
  msgRplyName='';
  replyToMessage(message :any){
    this.parentMessageId=message.key.id;
    this.replyToMesgClicked=true;
    this.addMessageForReply=message.messageAsText;
    this.msgRplyName=message.memberName
    this.openReplyOptionBox=false;
  }
  @ViewChild('replyButton') replyButton: ElementRef | undefined;
  optionsMenuVisible = false;
  selectedMessageId: number | null = null;
  selectForReply(messageId: any) {
    this.optionsMenuVisible = !this.optionsMenuVisible;

    this.selectedMessageId = messageId;
    this.openReplyOptionBox=true;
    this.optionsMenuVisible = !this.optionsMenuVisible;

  }

  isReplyingTo(messageId: any): boolean {
    // this.openReplyOptionBox=true;
    return this.selectedMessageId === messageId;
  }
  cancelReply(){
    this.replyToMesgClicked=false;
    this.openReplyOptionBox=false;
    this.parentMessageId='';
    this.addMessageForReply='';
  }

  getMemberImgUrl(memberId: number): string {
    return `${this.AVATAR_BASE_URL}/${memberId}/PROFILE/dp_50X50.jpg`;
  }

  onImgError(event: any) {
    event.target.src = 'assets/img/profile-finger-icon.webp';
  }

  getMessageId(id: string) {
    return `message_${id}`;
  }

  getAnchorHref(zollabContent: ZollabContent) {
    if (zollabContent.url?.includes('http')) {
      return zollabContent.url;
    } else {
      return 'http://' + zollabContent.url;
    }
  }

  loadChatOnDown(event: any) {
    /*   let target = event.target as HTMLElement;
       console.log(target.id);*/
    let messageCount = this.chat?.content?.length;
    if (messageCount === 0) {
      return;
    }
    let pivotId = this.chat?.content?.[messageCount! - 1].key?.id;
    console.log('DOWN', pivotId);
    console.log('COUNT', messageCount);
    this.chatService.getDown(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, pivotId!)
      .subscribe((chat) => {
        console.log('this.chat?.content)', this.chat?.content);
        if (!!this.chat?.content) {
          if(chat.content!==undefined)
            this.chat?.content?.push(...chat.content!);
        }
      });
  }

  loadChatOnUp() {
    console.log('Going up');
    let messageCount = this.chat?.content?.length;
    if (messageCount === 0) {
      return;
    }
    let pivotId = this.chat?.content?.[0].key?.id;
    this.chatService.getUp(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, pivotId!)
      .subscribe((chat) => {
        if (!!chat.content) {
          this.chat?.content?.unshift(...chat.content!);
        }
      });
  }

  showMoreItems() {
    this.paginationLimit = Number(this.paginationLimit) + 3;

  }

  showLessItems() {
    console.log('showLessItems', this.paginationLimit);
    this.paginationLimit = Number(this.paginationLimit) - 3;
  }

  onclick() {
    this.visible = !this.visible;
  }

  approve() {
    const modalRef = this.openCalledPopup(ReviewApprovalComponent);
  }

  draftUpload() {
    const modalRef = this.openCalledPopup(DraftUploadComponent);//this.dialog.open(DraftUploadComponent,);
    modalRef.componentInstance.deliverables = this.deliverables;
    modalRef.result.then((result: { message: Content; }) => {
      if (!!result) {
        this.chat?.content?.push(result.message);
      }
    });
    this.addEscapeKeyListener(modalRef);
  }

  openSetting() {
    const modalRef = this.openCalledPopup(SettingComponent);//this.dialog.open(SettingComponent,);
    this.addEscapeKeyListener(modalRef);
  }

  openPayment() {
    const modalRef = this.openCalledPopup(PaymentComponent);// this.dialog.open(PaymentComponent,);
  }

  openStats() {
    const modalRef = this.openCalledPopup(StatsComponent); //this.dialog.open(StatsComponent,);
  }

  openDeliverableList() {
    const modalRef = this.openCalledPopup(DeliverableListComponent); //this.dialog.open(DeliverableListComponent,);
    modalRef.componentInstance.deliverables = this.deliverables;
    this.addEscapeKeyListener(modalRef);
  }

  openUploadDeliverable(deliverable: Deliverable) {
    const modalRef = this.openCalledPopup(UploadDeliverableComponent); //this.dialog.open(UploadDeliverableComponent,);
    modalRef.componentInstance.deliverable = deliverable;
    modalRef.result.then((result: { message: string; }) => {
      if (!!result) {
        if(result.message === 'success') {
          deliverable.status = "IN_REVIEW";
        }
        if(result.message === 'failure') {
          deliverable.status = "NOT_STARTED";
        }
      }
      else{
        deliverable.status = "NOT_STARTED";
      }
    });
    this.addEscapeKeyListener(modalRef);
  }

  loadChatOnRedirected(pivotId: string) {
    this.chatService.getUpDown(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, pivotId!)
      .subscribe((chat) => {
        if (this.chat?.content) {
          this.chat.content = chat.content;
          this.cdr.detectChanges();
          this.scrollToElement(pivotId);
        }
      });
  }

  scrollToElement(messageId: string) {
    const highlightedElement = document.querySelector('.highlighted');
    if (highlightedElement) {
      highlightedElement.classList.remove('highlighted');
    }

    const element = document.getElementById(`message_${messageId}`);
    if (element) {
      this.scrollIntoView(element);
      element.classList.add('highlighted');
    }
  }

  scrollIntoView(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const scrollableParent = this.findScrollableParent(element);
    if (scrollableParent) {
      const parentRect = scrollableParent.getBoundingClientRect();
      if (rect.top < parentRect.top || rect.bottom > parentRect.bottom) {
        scrollableParent.scrollTop = element.offsetTop - scrollableParent.offsetTop;
      }
    }
  }

  findScrollableParent(element: HTMLElement): HTMLElement | null {
    let currentElement = element.parentElement;
    while (currentElement) {
      if (currentElement.scrollHeight > currentElement.clientHeight) {
        return currentElement;
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  }

  toggleEmojiPicker() {
    // console.log(this.showEmojiPicker);
    this.showEmojiPickerNew = !this.showEmojiPickerNew
  }

  addEmoji(event:any) {
    console.log(this.message)
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`)
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    // this.showEmojiPicker = false;
  }
  emojiClose(){
    this.showEmojiPickerNew=false;

  }
  deleteMessage(chatContent: Content) {
    const dialogRef = this.openCalledPopup(RemoveFileComponent);//this.dialog.open(RemoveFileComponent);
    const userChoiceSubscription = this.createProjectDeliverableService.userChoice$.subscribe(result => {
      userChoiceSubscription.unsubscribe();
      if (result === 'delete') {
        this.chatService.deleteMessages(chatContent.key.teamId, chatContent.key.projectId, chatContent.key.id).subscribe(() => {

        })
        const messageIdToDelete = chatContent.key.id;
        if (this.chat && this.chat.content) {
          const index = this.chat.content.findIndex((content: any) => content.key.id === messageIdToDelete);
          if (index !== -1) {
            this.chat.content.splice(index, 1);
          }
        }
      }
      else if (result === 'close') {
        console.log('User chose to close');
      }
    });
    this.addEscapeKeyListener(dialogRef);
  }

  starMessage(chatContent: Content) {
    if (chatContent.star) {
      chatContent.star = false;
      this.chatService.starMessages(chatContent.key.teamId, chatContent.key.projectId, chatContent.key.id, chatContent).subscribe(() => {
      });
    } else {
      chatContent.star = true;
      this.chatService.starMessages(chatContent.key.teamId, chatContent.key.projectId, chatContent.key.id, chatContent).subscribe(() => {
      });
    }
  }

  getProjectMembers() {
    if (this.projectService.selectedProject.id) {
      this.projectService.getMembers(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id)
        .subscribe((projectMembers) => {
          this.projectMembers = projectMembers;
          this.index = projectMembers.length;
          this.getProjectMember();
        });
    }
  }

  modalRef:any=null;
  serachItem:any=''
  searchMessage(serachItem: any){
    const text = serachItem.target.value;
    let searchKey = text.toString().replace(/\+/g, '%2B');
    if (searchKey.length < 3) {
      return;
    }
    this.searchForMessageTyped(searchKey);
  }
  searchForMessageTyped(searchKey: any) {
    this.chatService.messageSearch(this.projectService.userId,this.teamService.selectedTeam.id,this.projectService.selectedProject.id, searchKey)
    .subscribe((chat:Chat) => {
      if (this.modalRef) {
        this.modalRef.close();
      }
      this.modalRef=this.openCalledPopup(StarredMessagesComponent);//this.dialog.open(StarredMessagesComponent);
      this.modalRef.componentInstance.receivedData = { key: chat, redirectFor:"msgSearch"};
    });
  }
  private removeMessageIdFromUrl(messageId:any) {
    const urlTree = this.router.parseUrl(this.router.url);
    delete urlTree.queryParams['messageId'];
    this.router.navigateByUrl(urlTree);
  }

  notifications: any = [] as UserNotification;
  loadNotifications() {
    this.notificationService.getAll()
      .subscribe((notifications) => {
        this.notifications = notifications;
        console.log(notifications);
      })
  }
  redirectToProjectDashBoard(){
    this.router.navigate(['/project-dashboard'])
  }
  enableMobileSearch:boolean = false;
  enableSearchBox(){
    this.enableMobileSearch=true;
  }
  cancelSearch(){
    this.serachItem='';
    this.enableMobileSearch=false;
  }

  openApproveDeliverable(deliverable: Deliverable) {
    const modalRef = this.openCalledPopup(ReviewApprovalComponent);//this.dialog.open(ReviewApprovalComponent);
    modalRef.componentInstance.deliverable = deliverable;
    modalRef.result.then((result: any) => {
      if (!!result) {
        deliverable.status = "APPROVED";
      }
    });
    this.addEscapeKeyListener(modalRef);
  }

  projectMemberImage:any=[];
  member:any={memberName:"",avtarUrl:''};
  getProjectMember(){
    this.projectMembers.forEach((item:ProjectMember) => {
      this.member={memberName:"",avtarUrl:''};
      this.member.memberName=item.memberName;
      this.member.avtarUrl=`${this.AVATAR_BASE_URL}/${item.memberId}/PROFILE/dp_50X50.jpg?ver=` + Math.random()
      this.projectMemberImage.push(this.member);
    });

  }

  tooltipContent: string = '';
  showImages = false;

  getTooltipContent(): string {
    const maxDisplayedImages = 2;
    let tooltipContent = '';

    for (let i = 0; i < Math.min(this.projectMemberImage.length, maxDisplayedImages); i++) {
      let pimg = this.projectMemberImage[i];
      tooltipContent += `<img [src]="${this.AVATAR_BASE_URL}/${pimg}" (error)="../../../assets/img/foreign-boy-icon.webp" alt="">`;
    }
    return tooltipContent;
  }

 // Inside your Angular component
  imageErrors: string[] = [];

  handleImageError(event:any) {
    event.target.src = '../../../assets/img/foreign-boy-icon.webp';
      // this.imageErrors.push(imageUrl);
  }

  isImageError(imageUrl: string): boolean {
      return this.imageErrors.includes(imageUrl);
  }


  // noShowDeliverableContent(){
  //     this.showDeliverableMessage=!this.showDeliverableMessage;
  // }

  getFormattedTime(date: string) {
    const currentDate = new Date();
    const inputDate = new Date(date);
    const timezoneOffset = currentDate.getTimezoneOffset();
    inputDate.setMinutes(inputDate.getMinutes() - timezoneOffset);
    const providedDate = new Date(inputDate);
    const timeDifference: number = currentDate.getTime() - providedDate.getTime() + 3000;
    const secondsDifference: number = Math.floor(timeDifference / 1000);
    const minutesDifference: number = Math.ceil(secondsDifference / 60);

    if (minutesDifference === 0) {
      return `1 minute`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''}`;
    }

    const hoursDifference: number = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''}`;
    }

    const daysDifference: number = Math.floor(hoursDifference / 24);
    return `${daysDifference} day${daysDifference !== 1 ? 's' : ''} ago`;
  }

  openApproveMessage(chatContent: any) {
    const deliverableId = parseInt(chatContent.metaData.deliverableId, 10);
    const selectedDeliverable = this.deliverables.find((deliverable) => deliverable.id === deliverableId);
    if (selectedDeliverable) {
      const modalRef = this.openCalledPopup(ReviewApprovalComponent);//this.dialog.open(ReviewApprovalComponent);
      modalRef.componentInstance.deliverable = selectedDeliverable;
      modalRef.result.then((result: any) => {
        if (!!result) {
          this.deliverables.forEach((deliverable) => {
            if (deliverable.id === deliverableId) {
              this.updateMessageStatus(chatContent);
            }
          });
        }
      });
      this.addEscapeKeyListener(modalRef);
    }
  }

  openImagePreview(imageUrl:any, contentType:any): void {
    const modalRef=this.dialog.open(ImagePreviewDialogComponent, {
      size: 'lg', // Set the size of the modal, adjust as needed
      centered: true, // Center the modal
      windowClass: 'image-preview-modal', // Add a custom class for styling
    });
    modalRef.componentInstance.receivedData = { key: imageUrl };
    modalRef.componentInstance.contentType = contentType;
    modalRef.componentInstance.maxWidth = '90vw';
    modalRef.componentInstance.maxHeight = '85vh';
  }

  openPaymentComponent(chatContent: any) {
    const deliverableId = parseInt(chatContent.metaData.deliverableId, 10);
    const selectedDeliverable = this.deliverables.find((deliverable) => deliverable.id === deliverableId);
    if (selectedDeliverable) {
      const modalRef = this.openCalledPopup(PaymentComponent);//this.dialog.open(PaymentComponent);
      modalRef.componentInstance.deliverable = selectedDeliverable;
      modalRef.result.then((result: any) => {
        if (!!result) {
          this.deliverables.forEach((deliverable) => {
            if (deliverable.id === deliverableId) {
              deliverable.status = "paid";
            }
          });
          chatContent.metaData.actionStatus = 'paid';
        }
      });
      this.addEscapeKeyListener(modalRef);
    }
  }

  clickToPublishDelierable(chatContent: any) {
    const deliverableId = parseInt(chatContent.metaData.deliverableId, 10);
    const selectedDeliverable = this.deliverables.find((deliverable) => deliverable.id === deliverableId);
    if (selectedDeliverable) {
      const modalRef = this.openCalledPopup(UploadDeliverableComponent);//this.dialog.open(UploadDeliverableComponent);
    modalRef.componentInstance.deliverable = selectedDeliverable;
    modalRef.componentInstance.receivedData = {deliverableStep:'publish'};
    modalRef.result.then((result: { message: Content; }) => {
      if (!!result) {
        this.chat?.content?.push(result.message);
        this.updateMessageStatus(chatContent);
      }
    });
      this.addEscapeKeyListener(modalRef);
    }
  }
  isSentByCurrentUser(sentBy: any): boolean {
    return sentBy === this.teamService.userId;
  }

  proceedToUnapproved(chatContent:any){
    const deliverableId = parseInt(chatContent.metaData.deliverableId, 10);
    // const selectedDeliverable = this.deliverables.find((deliverable) => deliverable.id === deliverableId);
    this.deliverableService.unapproved(this.teamService.selectedTeam.id, this.projectService.selectedProject.id, deliverableId).subscribe(() => {
     this.updateMessageStatus(chatContent);
    });
  }

  updateMessageStatus(chatContent: any) {
    this.chatService.getMessageById(this.projectService.userId, this.teamService.selectedTeam.id!,this.projectService.selectedProject.id!,
      chatContent.key?.id!).subscribe((content) => {
      if (!content) {
        return;
      }

      if (this.chat?.content) {
        const index = this.chat.content.findIndex((message) => message.key?.id === content.key.id);
        if (index !== -1) {
          this.chat.content[index] = content;
        }
      }

      this.chatService.getUp(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id!, chatContent.key?.id!
      ).subscribe((chat) => {
        if (this.chat?.content) {
          this.chat.content = chat.content;
          this.cdr.detectChanges();
          // Scroll down to the last message
          setTimeout(() => {
            this.scrollToBottom();
           });
        }
      });
    });
  }

  openReUploadPopup(deliverableId: number){
    const matchedDeliverable = this.deliverables.find(deliverable => deliverable.id === Number(deliverableId));
    if (matchedDeliverable) {
      this.openUploadDeliverable(matchedDeliverable);
    } else {
      console.log('Deliverable not found');
    }
  }
  getProjectPermission(){
    this.projectPermission = [];
    this.projectService.projectPermission(this.teamService.selectedTeam.id!, this.projectService.selectedProject.id! ).subscribe((project) => {
      this.projectPermission = project;
      console.log(this.projectPermission);
    });
  }

  openCalledPopup(componentName:any): any{
    const modalRef =this.dialog.open(componentName,{ariaLabelledBy: 'modal-basic-title',backdrop: true, centered: true,windowClass: 'custom-modal'});
    return modalRef;
  }
  toggleSearchIcon(event: any) {
    const value = event?.target?.value || '';
    this.showSearchIcon = !value.trim();
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
  teams: Team[] = [];
  profileImageVer = 1;
  intervalId?: any;
  teamIndex = 0;
  teamPermission: any = [];
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
  logout() {
    this.stopLoadingUnreadCount();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
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
  getMemberProfile(): string {
    return `${this.AVATAR_BASE_URL}/${this.userId}/PROFILE/dp_50X50.jpg?ver=` + this.profileImageVer;
  }

  checkForAtSymbol(event: any) {
    const searchText = event.target.value.toLowerCase().trim();
    const atIndex = searchText.indexOf('@');
    if (atIndex > -1 && atIndex < searchText.length - 1) {
      const searchTerm = searchText.substring(atIndex + 1);
        this.filteredMembers = this.projectMembers.filter((member: any) => member.memberName.toLowerCase().startsWith(searchTerm));
        this.showDiv = true;
    } else {
        this.showDiv = false;
    }
}

setMemberName(member: any) {
  this.message = this.message.replace(/@\w+\s*$/, `@${member.memberName} `);
  this.showDiv = false;
}
}

