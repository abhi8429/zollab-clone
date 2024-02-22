import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {WorkspaceService} from "../../../services/workspace.service";
import {Member} from "../../../model/member";
import {Observable, Subscription} from "rxjs";
import {
  InviteWorkspaceMembersComponent
} from "../../../modals/invite-workspace-members/invite-workspace-members.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChatService} from "../../../services/chat.service";
import {AuthService} from "../../../auth/auth.service";
import {GroupChannel} from "@sendbird/chat/groupChannel";
import {Router} from "@angular/router";
import {AddChannelComponent} from "../../../modals/add-channel/add-channel.component";

@Component({
  selector: 'app-selected-workspace',
  templateUrl: './selected-workspace.component.html',
  styleUrls: ['./selected-workspace.component.css']
})
export class SelectedWorkspaceComponent implements OnInit, OnDestroy {
  workspaceSettings!: boolean;
  members!: Member[];
  _selectedWorkspace!: Workspace;
  @Input() membersInvited!: Observable<void>;
  private membersInvitedEventsSubscription: Subscription | undefined;
  channelList!: GroupChannel[];
  @Output() selectedType = new EventEmitter<string>();
  @Output() selectedChannel = new EventEmitter<GroupChannel>();

  constructor(private workspaceService: WorkspaceService, private dialog: NgbModal,
              private chatService: ChatService, private authService: AuthService,
              private router: Router) {
    /*if(!!this.selectedWorkspace)
      this.getWorkspaceMembers();*/
  }

  getWorkspaceMembers() {
    this.workspaceService.getMembers(this._selectedWorkspace.id!).subscribe((response) => {
      this.members = response;
    })
  }


  ngOnInit(): void {
    /*if (!!this.selectedWorkspace) {
        this.getWorkspaceMembers();
    }
    this.membersInvitedEventsSubscription = this.membersInvited?.subscribe(() => {
        this.getWorkspaceMembers();
    })*/
  }

  @Input()
  set selectedWorkspace(value: Workspace) {
    this._selectedWorkspace = value;
    this.getChannels();
    // this.getWorkspaceMembers();
  }

  ngOnDestroy() {
    this.membersInvitedEventsSubscription?.unsubscribe();
  }

  inviteMembers() {
    const modalRef = this.dialog.open(InviteWorkspaceMembersComponent);
    modalRef.componentInstance.workspace = this._selectedWorkspace;
    modalRef.result.then((result) => {
      if (result.membersInvited) {
        // this.getWorkspaceMembers();
      }
    })
  }

  getChannels() {
    if (!!this._selectedWorkspace) {
      this.chatService.login(this.authService.getUser().id!.toString()).then((response: any) => {
        console.log('login ', response);
        this.chatService.getGroupChannelList(this._selectedWorkspace.id!).then((list: GroupChannel[]) => {
          console.log(list);
          this.channelList = list;
        });
      });
    }
  }

  emitChannelSelection(channel: GroupChannel) {
    this.selectedChannel.emit(channel);
    this.selectedType.emit("CHAT");
  }

  addChannel() {
    const modalRef = this.dialog.open(AddChannelComponent);
    modalRef.componentInstance.workspace = this._selectedWorkspace;
    modalRef.result.then((result)=> {
      if(!!result)
        this.getChannels();
      }
    );
  }
}
