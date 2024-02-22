import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Team} from "../../model/team";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TeamService} from "../../services/team.service";
import {ProjectService} from "../../services/project.service";
import {firstValueFrom} from "rxjs";
import {Content} from "../../model/chat";
import {ChatMessageService} from "../../services/chat-message.service";
import {Deliverable} from "../../model/deliverable";
import {UploadDeliverableComponent} from "../upload-deliverable/upload-deliverable.component";

@Component({
  selector: 'app-draft-upload',
  templateUrl: './draft-upload.component.html',
  styleUrls: ['./draft-upload.component.css']
})
export class DraftUploadComponent implements OnInit {
  @Input()
  deliverables: any[] = [];
  @Input()
  contentFileType: string = 'image';

  contentFile: File | undefined;
  contentFileName: string = '';
  contentUrl: any;
  contentFileTypes: { [key: string]: string} = {imageOrVideo: 'image/*,video/*', application: '.pdf,.docx'};

  constructor(private dialog: NgbModal,
              private activeModal: NgbActiveModal,
              private teamService: TeamService,
              private projectService: ProjectService,
              private chatService: ChatMessageService) {

  }
  uploadFileType:boolean=false;
  ngOnInit(): void {
   this.uploadFileType= this.chatService.uploadFileType
  }
  uploadFile(event: any) {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
        reader.onload = () => {
          this.contentUrl = reader.result;
        }
      this.contentFile = file;
      this.contentFileName = file.name;
    }
  }

  get isImageOrVideo() {
    return this.isVideo || this.isImage;
  }

  get isImage() {
    return this.contentFile && this.contentFile.type.includes('image')
  }

  get isVideo() {
    return this.contentFile && this.contentFile.type.includes('video')
  }

  async uploadDraft() {
    if (!this.contentFile) {
      return;
    }

    let teamId = this.teamService.selectedTeam.id;
    let projectId = this.projectService.selectedProject.id;

    const formData = new FormData();
    formData.append('file', this.contentFile!, this.contentFileName);
    let attachment = await firstValueFrom(this.projectService.uploadAttachment(teamId!, projectId!, formData));

    let content: Content = {} as Content
    content.messageAsText = `Project attachment uploaded - ${attachment.fileName}.${attachment.ext}`;
    content.key = {teamId, projectId, sentBy: this.teamService.userId};
    if (attachment) {
      content.metaData = {'zollabContentId': attachment.id};
    }
    this.chatService.create(teamId!, projectId!, content).subscribe((chatContent) => {
      //Emit message once done
      this.activeModal.close({message: chatContent});
    });
  }

  openUploadDeliverable(deliverable: Deliverable) {
    const modalRef = this.dialog.open(UploadDeliverableComponent, {ariaLabelledBy: 'modal-basic-title',backdrop: 'static', keyboard: false, centered: true,windowClass: 'custom-modal'});
    modalRef.componentInstance.deliverable = deliverable;
    modalRef.result.then((result) => {
      this.close();
     /* if (!!result) {
        this.chat?.content?.push(result.message);
      }*/
    });
  }

  close() {
    this.activeModal.close();
  }

}
