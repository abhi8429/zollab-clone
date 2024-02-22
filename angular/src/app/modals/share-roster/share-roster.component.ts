import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Roster} from "../../model/roster";
import {RosterService} from "../../services/roster.service";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-share-roster',
  templateUrl: './share-roster.component.html',
  styleUrls: ['./share-roster.component.css']
})
export class ShareRosterComponent implements OnInit {
  @Input() roster!: Roster;
  inviteUrl!: string;
  invitedEmails: string | undefined;

  imageUrl: any = 'assets/img/profile-add-up-white-arrow.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  @ViewChild('fileInput') el!: ElementRef;
  rosterImage: File | undefined;

  constructor(public activeModal: NgbActiveModal, private rosterService: RosterService,
              private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.inviteUrl = `https://devdeal.stella.so/rosters/${this.roster?.encodedInviteCode}`;
  }

  invite() {
    if(this.invitedEmails === undefined) {
      return;
    }
    this.rosterService.invite(this.roster.id!, this.invitedEmails).subscribe((response) => {
      console.log(response);
      if(response.status === HttpStatusCode.Ok) {
        this.activeModal.close({membersInvited: true});
      }
    })
  }

  uploadFile(event: any) {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editFile = false;
        this.removeUpload = true;
      }
      this.rosterImage = file;
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
      this.uploadRosterLogo();
    }
  }

  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'assets/img/profile-add-up-white-arrow.png';
    this.editFile = true;
    this.removeUpload = false;
    this.rosterImage = undefined;
  }

  private uploadRosterLogo() {
    const formData = new FormData();
    formData.append('file', this.rosterImage!, this.rosterImage!.name);
    this.rosterService.uploadRosterImage(this.roster.id!, formData).subscribe((response) => {
      console.log('rosterImage', response);
    });
  }
}
