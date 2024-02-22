import {ChangeDetectorRef, Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../model/user";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent {
  user!: User;
  editEmail!: boolean;
  editPhone!: boolean;
  private submitted!: boolean;
  imageUrl: any = 'assets/img/profile-add-up-white-arrow.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  avatarImage: File | undefined;

  constructor(private userService: UserService,
              public fb: FormBuilder,
              authService: AuthService,
              private router: Router,
              private cd: ChangeDetectorRef,
              private localStorageService: LocalStorageService) {
    this.user = authService.getUser();
    this.imageUrl = !!this.user.avatars?.["ORIGINAL"] ? this.user.avatars?.["ORIGINAL"] : this.imageUrl;
    this.patchForm();
  }

  profileForm = this.fb.group({
    displayName: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
  })

  onSubmit() {
    console.log(this.profileForm.value)
    this.submitted = true;
    if(!this.profileForm.valid) {
      return;
    } else {
      console.log(this.profileForm.value)
      this.userService.updateProfile(this.profileForm.value, this.user.id!).subscribe((response) => {
        console.log(response.status);
        if(!!response) {
          this.localStorageService.store('user', response);
          this.router.navigate(["/CreateWorkspace"])
        }
      });
    }
  }

  private patchForm() {
    this.profileForm.patchValue({
      name: this.user.name,
      displayName: this.user.name,
      email: this.user.email,
      phone: this.user.phone
    })
  }

  uploadFile(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      this.avatarImage = file;
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      // this.cd.markForCheck();
    }
  }

  removeUploadedFile() {
    this.imageUrl = 'assets/img/profile-add-up-white-arrow.png';
    this.editFile = true;
    this.removeUpload = false;
    this.avatarImage = undefined;
  }

  uploadProfileImage() {
    const formData = new FormData();
    formData.append('file', this.avatarImage!, this.user.id+'');
    this.userService.uploadAvatar(this.user.id!, formData).subscribe((response) => {
      console.log(response);
      if(!!response) {
        this.userService.getUserProfile(this.user.id!).subscribe((response) => {
          this.localStorageService.store('user', response);
        })
      }
    })
  }
}
