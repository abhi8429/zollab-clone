import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";
import {ContentService} from "../../services/content.service";
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [NgbModal],
})
export class ProfileComponent implements OnInit {

  imageFile: File | undefined;
  imageFileName: string = '';
  imageUrl: any = null;
  @ViewChild('profileForm') profileForm!: NgForm;

  user = {} as User;
  confirmPassword?: string;

  submitted: boolean = false;
  readonly AVATAR_BASE_URL;

  constructor(public activeModal: NgbActiveModal,
              private userService: UserService,
              contentService: ContentService
  ) {
    this.user = userService.getLocalUser();
    this.AVATAR_BASE_URL = contentService.getAvatarURL();
    this.imageUrl = `${this.AVATAR_BASE_URL}/${this.user.id}/PROFILE/dp_50X50.jpg?ver=` + Math.random();
  }

  ngOnInit(): void {
    this.submitted = false;
    this.user.password = '';
    this.user.newPassword = '';
  }

  onImgError(event: any) {
    event.target.src = '../../../assets/img/app-icon.svg';
  }

  // uploadFile(event: any) {
  //   this.imageChangedEvent = event;
  //   let reader = new FileReader();
  //   let file: File = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.imageUrl = reader.result;
  //     }
  //     this.imageFile = file;
  //     this.imageFileName = file.name;
  //   }
  // }
  uploadFile(event: any): void {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    // if (event.target.files && event.target.files[0]) {
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.imageUrl = reader.result as string;
    //     console.log("this.imageUrl---"+this.imageUrl)
    //   }
    //   this.imageFile = file;
    //   this.imageFileName = file.name;
    // }
  }

  close() {
    this.activeModal.close();
  }

  save() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    this.userService.updateProfile(this.user, this.user.id!).subscribe((user) => {
      this.userService.setLocalUser(user);
      this.close();
    });


  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  enableCropper:boolean=false;
  fileChangeEvent(event: any): void {
      this.enableCropper=true;
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      const croppedBlob: Blob | null | undefined = event?.blob;

      // Check if the Blob is not null or undefined
      if (croppedBlob) {
        // Create a File object
        const croppedFile = new File([croppedBlob], 'cropped-image.png', { type: 'image/png' });

        // Now you can use croppedFile as needed

          this.imageFile = croppedFile;
          this.imageFileName = croppedFile.name;

      } else {
        console.error('The croppedBlob is null or undefined.');
      }


  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  saveProfileImage(){
    if (this.imageFile) {
      const formData = new FormData();
      formData.append('file', this.imageFile, this.imageFileName);
      this.userService.uploadAvatar(this.user.id!, formData).subscribe((url) => {
        console.log("url---"+url);
        this.enableCropper=false;
        this.imageUrl = `${this.AVATAR_BASE_URL}/${this.user.id}/PROFILE/dp_50X50.jpg?ver=` + Math.random();
      });
    }
  }
}
