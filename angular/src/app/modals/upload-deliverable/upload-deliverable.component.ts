import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectDeliverable} from "../../model/project-deliverable";
import {TeamService} from "../../services/team.service";
import {ProjectService} from "../../services/project.service";
import {ChatMessageService} from "../../services/chat-message.service";
import {firstValueFrom} from "rxjs";
import {Content} from "../../model/chat";
import {ProjectDeliverableService} from "../../services/proiect.deliverable.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload-deliverable',
  templateUrl: './upload-deliverable.component.html',
  styleUrls: ['./upload-deliverable.component.css']
})
export class UploadDeliverableComponent implements OnInit{

  @ViewChild("fileInput")
  fileInput?: ElementRef;

  @Input()
  deliverable?: ProjectDeliverable;
  @Input()
  receivedData?:any= '';
  deliverableStep:any='';
  title = "Upload";
  contentFile: File | null = null;
  contentFileName: string = '';
  contentUrl: any;
  url?: string | null;
  scheduledPublishDate?: string;
  fileUploaded : boolean = false;
  caption?: string | null;

  constructor(private activeModal: NgbActiveModal,
              private teamService: TeamService,
              private projectService: ProjectService,
              private deliverableService: ProjectDeliverableService,
              private chatService: ChatMessageService,
              private router: Router) {

  }
  ngOnInit(): void {
    this.deliverableStep=this.receivedData.deliverableStep;
    console.log("this.deliverableStep"+this.deliverableStep)
    if(this.deliverableStep=='publish'){
      this.title="Publish"
    }
  }
  uploadFile(event: any) {
    this.fileUploaded = true;
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.contentUrl = reader.result;
      }
      this.contentFile = file;
      console.log('this.contentFile', this.contentFile);
      this.contentFileName = file.name;
      this.url = null;
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

  removeAttachment() {
    this.fileInput!.nativeElement.value = null;
    this.contentFile = null;
    this.contentFileName = '';
    this.fileUploaded = false;
  }

  urlAdded() {
    console.log('changed', this.url);
    if (this.url?.trim()) {
      this.removeAttachment();
    }
  }

   uploadNow() {
     if (!this.contentFile && !this.url) {
       return;
     }
     if (this.contentFile) {
       this.router.navigate(['/loading-bar']);
       this.activeModal.close();
     }
     let teamId = this.teamService.selectedTeam.id;
     let projectId = this.projectService.selectedProject.id;

     const formData = new FormData();
     if (this.contentFile) {
       formData.append('file', this.contentFile!, this.contentFileName);
     } else {
       formData.append('url', this.url!);
     }

     if (this.caption) {
       formData.append('caption', this.caption!);
     }
     if (this.deliverableStep == 'publish') {
       this.deliverableService.patchDeliverable(teamId!, projectId!, this.deliverable?.id!, formData).subscribe((chatContent) => {
           this.router.navigate(['/chat-dashboard']);
           this.activeModal.close({message: chatContent});
         },
         (error) => {
           this.router.navigate(['/chat-dashboard']);
         }
       )
     } else {
       this.deliverableService.uploadAttachment(teamId!, projectId!, this.deliverable?.id!, formData)
         .subscribe({
           next: () => {
             this.activeModal.close({message : 'success'});
             this.router.navigate(['/chat-dashboard']);
           },
           error: (error) => {
             this.activeModal.close({message : 'failure'});
             this.router.navigate(['/chat-dashboard']);
           }
         });
     }
   }
  close() {
    this.activeModal.close();
  }
}
