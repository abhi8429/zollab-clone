import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {debounceTime, distinctUntilChanged, Observable, switchMap} from "rxjs";
import {Workspace} from "../../../model/workspace";
import {User} from "../../../model/user";
import {UserService} from "../../../services/user.service";
import {ChatService} from "../../../services/chat.service";
import {GroupChannel} from "@sendbird/chat/groupChannel";

@Component({
  selector: 'app-invite-channel-members',
  templateUrl: './invite-channel-members.component.html',
  styleUrls: ['./invite-channel-members.component.css']
})
export class InviteChannelMembersComponent {
  @Input() workspace!: Workspace;
  @Input() channel!: GroupChannel;
  inviteUrl!: string;
  user: User | undefined;
  dataMembers: User[] = [];
  constructor(public activeModal: NgbActiveModal,
              private userService: UserService,
              private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.inviteUrl = `https://devdeal.stella.so/${this.workspace?.inviteCode}`;
  }

  search = (text: Observable<string>) => {
    return text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchText) =>
        searchText.length >= 4 ? this.userService.searchUser(searchText) : []
      )
    );
  }

  formatter = (x: { email: string }) => x.email;

  addMember(user: any) {
    this.dataMembers.push(user.item);
  }
  inviteMembers() {
    if(this.dataMembers.length > 0) {
      const membersToInvite: string[] = [];
      this.dataMembers.forEach((user) => {
        membersToInvite.push(user.id?.toString()!);
      });
      this.chatService.inviteToGroupChannel(this.channel, membersToInvite!).then((channel) => {
        console.log(channel);
        this.activeModal.dismiss();
      })
    }
  }
}
