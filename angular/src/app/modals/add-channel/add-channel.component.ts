import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ChatService} from 'src/app/services/chat.service';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Workspace} from "../../model/workspace";
import {MetaData} from "@sendbird/chat";


@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent {

  @Input() workspace!: Workspace;
  createChannelForm!: FormGroup;
  submitted = false;

  constructor(public activeModal: NgbActiveModal, private chatService: ChatService) {
    this.createChannelForm = new FormGroup({
      channelName: new FormControl('', [Validators.required]),
      channelDescription: new FormControl()
    })
  }

  saveChannel() {
    this.submitted = true;
    if (this.createChannelForm.invalid) {
      return;
    }
    this.chatService.createChannel(this.createChannelForm.value['channelName'],
      this.createChannelForm.value['channelDescription']).then((channel: any) => {
      this.chatService.createChannelMeta(channel, this.workspace.id!).then((metaData: MetaData) => {
        this.activeModal.close(true);
      }).catch((error) => {
        this.activeModal.close(false);
      })
    });
  }

}
