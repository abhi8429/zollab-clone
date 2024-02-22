import {ChangeDetectorRef, Component, OnChanges, SimpleChanges} from '@angular/core';
import {WorkspaceService} from "../../services/workspace.service";
import {Workspace} from "../../model/workspace";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  InviteWorkspaceMembersComponent
} from "../../modals/invite-workspace-members/invite-workspace-members.component";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {SessionStorageService} from "ngx-webstorage";
import {AuthService} from "../../auth/auth.service";
import {GroupChannel} from "@sendbird/chat/groupChannel";
import {ChatService} from "../../services/chat.service";
import {BaseMessage} from "@sendbird/chat/message";
import {GroupMessage} from "../../model/group-message";
import {
  InviteChannelMembersComponent
} from "../../modals/invite-channel-members/invite-channel-members/invite-channel-members.component";
import {UserMessage} from "@sendbird/chat/lib/__definition";


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
})

export class WorkspaceComponent implements OnChanges {
  workspaces: Workspace[] = [];
  userSettings!: boolean;
  workspaceSettings!: boolean;
  selectedWorkspace!: Workspace;
  hideLeftMenu!: boolean;
  membersInvited: Subject<void> = new Subject<void>();
  selectedType!: string;
  selectedChannel!: GroupChannel;
  chatMessage = '';
  threadMessage = '';
  channelMessages: GroupMessage[] = [];
  threadMessages!: { parentMessage: GroupMessage; threadedMessages: GroupMessage[] };
  chatMode!: string;
  private editedMessage: GroupMessage | undefined;

  constructor(private workspaceService: WorkspaceService,
              private dialog: NgbModal,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private sessionStorageService: SessionStorageService,
              private authService: AuthService,
              private chatService: ChatService,
              private cd: ChangeDetectorRef) {

    const encodedInviteCode = this.activatedRoute.snapshot.paramMap.get('encodedInviteCode');
    if (!!encodedInviteCode) {
      if (this.authService.isLoggedIn) {
        workspaceService.getInvitedWorkspace(encodedInviteCode).subscribe((response) => {
          this.selectedWorkspace = response;
          this.sessionStorageService.store("selectedWorkspace", this.selectedWorkspace);
        });
      } else {
        sessionStorageService.store('invitedWorkspace', encodedInviteCode);
        router.navigate(['login'])
      }
    }
  }

  inviteMembers() {
    const modalRef = this.dialog.open(InviteWorkspaceMembersComponent);
    modalRef.componentInstance.workspace = this.selectedWorkspace;
    modalRef.result.then((result) => {
      if (result.membersInvited) {
        this.membersInvited.next();
      }
    })
  }

  getChannelMessages() {
    console.log('-------------------------');
    this.chatService.getChannelMessages(this.selectedChannel, 50).then((messages: BaseMessage[]) => {
      this.channelMessages = messages;
      console.debug('Channel Messages', this.channelMessages);
      console.log('Channel Messages', this.channelMessages);
      setTimeout(() => {
        this.getPinnedMessages();
        this.scrollToBottom();
      }, 0);
    })
  }

  sendChatMessage() {
    if (!!this.chatMessage.trim()) {
      this.chatService.sendMessage(this.selectedChannel, this.chatMessage)
        .onSucceeded((message) => {
          this.channelMessages = this.channelMessages.concat(message);
          this.chatMessage = '';
        }).onPending((message) => {
        console.warn('pending', message);
      }).onFailed((error) => {
        console.error('failed', error);
      })
    }
  }

  updateChannel(channel: GroupChannel) {
    this.selectedChannel = channel;
    this.getChannelMessages();
  }

  getReplies(channelMessage: any) {
    let emojis: [] = []
    this.chatService.getThreadMessages(channelMessage).then((message) => {
      console.debug('Channel Messages', message);
      // open sidebar
      document.getElementById('message_sidebar')?.classList.add('show');
      this.threadMessages = message;
      console.log('Channel Messages', this.threadMessages);
      /*message.threadedMessages.forEach((threadedMessage) => {
      if (threadedMessage.data) {
        let dataObj: { emoji: any } = JSON.parse(threadedMessage.data);
        // @ts-ignore
        emojis.push(dataObj.emoji);
      }
      console.log('emojis : ', emojis);
    });*/
    })
  }

  addEmoji(message: GroupMessage, emoji: string) {
    this.chatService.sendEmoji(this.selectedChannel, message, emoji).then(() => {
    });
  }

  removeEmoji(message: GroupMessage, emoji: string) {
    this.chatService.removeEmoji(this.selectedChannel, message, emoji).then(() => {
    });
  }

  scrollToBottom() {
    const container = document.getElementById('chat_messages_scroll') as HTMLElement;
    const threadContainer = document.getElementById('chat_messages_scroll_thread') as HTMLElement;
    container.scrollTop = container.scrollHeight
    threadContainer.scrollTop = threadContainer.scrollHeight
  }

  hideMessageSidebar() {
    document.getElementById('message_sidebar')?.classList.remove('show');
    this.getChannelMessages();
  }

  inviteChannelMembers() {
    const modalRef = this.dialog.open(InviteChannelMembersComponent);
    modalRef.componentInstance.channel = this.selectedChannel;
    modalRef.componentInstance.workspace = this.selectedWorkspace;
  }

  sendReplyMessage(parentMessageId: number | undefined) {
    console.log('parentMessageId', parentMessageId);
    if (!!this.threadMessage.trim()) {
      this.chatService.sendMessage(this.selectedChannel, this.threadMessage, parentMessageId)
        .onSucceeded((message) => {
          this.threadMessages.threadedMessages = this.threadMessages?.threadedMessages.concat(message);
          this.threadMessage = '';
        }).onPending((message) => {
        console.warn('pending', message);
      }).onFailed((error) => {
        console.error('failed', error);
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('----------------------', changes);
  }

  deleteMessage(message: GroupMessage) {
    this.chatService.deleteMessage(this.selectedChannel, message)
      .then(() => {
        this.delMessage(message);
      })
      .catch((error) => {
        console.error('failed', error);
      })
  }

  private delMessage(deletedMessage: GroupMessage) {
    const messageIndex = this.channelMessages.findIndex((message => message.messageId === deletedMessage.messageId));
    this.channelMessages.splice(messageIndex, 1);
    this.channelMessages = [...this.channelMessages];
  }

  sendFileMessage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file: File = event.target.files[0];
      console.log(file);
      this.chatService.sendFileMessage(this.selectedChannel, file)
        .onSucceeded((message) => {
          this.channelMessages = this.channelMessages.concat(message);
          this.chatMessage = '';
        }).onPending((message) => {
        console.warn('pending', message);
      }).onFailed((error) => {
        console.error('failed', error);
      })
    }
  }

  sendReplyFileMessage(event: any, parentMessageId: number | undefined) {
    alert(parentMessageId);
    if (event.target.files && event.target.files[0]) {
      let file: File = event.target.files[0];
      console.log(file);
      this.chatService.sendFileMessage(this.selectedChannel, file, parentMessageId)
        .onSucceeded((message) => {
          this.threadMessages.threadedMessages = this.threadMessages?.threadedMessages.concat(message);
          this.threadMessage = '';
        }).onPending((message) => {
        console.warn('pending', message);
      }).onFailed((error) => {
        console.error('failed', error);
      })
    }
  }

  pinUnpinMessage(message: GroupMessage, pin: boolean) {
    this.chatService.pinMessage(this.selectedChannel, message, pin).then(() => {
      message.pinned = pin;
    });
  }

  private replaceMessage(message: GroupMessage, pinned: boolean) {
    const filteredMessage = this.channelMessages.find((m => m.messageId === message.messageId));
    filteredMessage!.pinned = pinned;
  }


  /*isEditAble() {
    return (this.message && this.message.messageType === 'user'
      && this.message.sender.userId === this.sbUser.userId);
  },*/
  isPinnable(message: GroupMessage) {
    return (message && message.sender!.userId === this.authService.getUser().id!.toString());
  }

  isDeletable(message: GroupMessage) {
    if(message.threadInfo?.replyCount === undefined) {
      return (message && message.sender!.userId === this.authService.getUser().id!.toString());
    }
    return false;
  }

  getPinnedMessages() {
    this.chatService.getPinnedChannelMessages(this.selectedChannel).then((response) => {
      console.log('pinnedd', response);
      response.forEach((message) => {
        this.replaceMessage(message.message!, true);
      })
      this.channelMessages = [...this.channelMessages];
    });
  }

  editMessage(messageObj: GroupMessage) {
    this.chatMessage = messageObj.message!;
    this.chatMode = 'EDIT';
    this.editedMessage = messageObj;
  }

  updateMessage() {
    this.chatService.updateMessage(this.selectedChannel, this.editedMessage!, this.chatMessage).then((message) => {
      this.replaceUserMessage(message);
      this.resetData();
    })
  }

  udateFileMessage() {

  }

  resetData() {
    this.chatMessage = '';
    this.editedMessage = undefined;
    //Switch back to default
    this.chatMode = 'REGULAR';
  }

  replaceUserMessage(message: UserMessage) {
    const index = this.channelMessages.findIndex((msg) => msg.messageId === message.messageId);
    this.channelMessages[index] = message;
    this.channelMessages = [...this.channelMessages];
  }

}
