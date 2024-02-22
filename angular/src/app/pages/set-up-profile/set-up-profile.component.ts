import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {LocalStorageService} from "ngx-webstorage";
import {WorkspaceService} from "../../services/workspace.service";

@Component({
  selector: 'app-set-up-profile',
  templateUrl: './set-up-profile.component.html',
  styleUrls: ['./set-up-profile.component.css']
})
export class SetUpProfileComponent {
  showPass:boolean=false;
  email!: string;
  userId!: number;
  submitted = false;
  @ViewChild('fileInput') el!: ElementRef;
  imageUrl: any = 'assets/img/profile-add-up-white-arrow.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  avatarImage: File | undefined;

  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private workspaceService: WorkspaceService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation = this.router.getCurrentNavigation();
        this.email = navigation?.extras.state ? navigation.extras.state?.['email'] : '';
        this.userId = navigation?.extras.state ? navigation.extras.state?.['userId'] : '';
      });
  }

  profileForm = this.fb.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
    bio: ['']
  })

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
      this.cd.markForCheck();
    }
  }

  removeUploadedFile() {
    this.imageUrl = 'assets/img/profile-add-up-white-arrow.png';
    this.editFile = true;
    this.removeUpload = false;
    this.avatarImage = undefined;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.profileForm.valid) {
      return;
    } else {
      this.userService.updateProfile(this.profileForm.value, this.userId).subscribe((response) => {
        if (!!response) {
          this.localStorageService.store('user', response);
          if (!!this.avatarImage) {
            const formData = new FormData();
            formData.append('file', this.avatarImage!, this.userId + '');
            this.userService.uploadAvatar(this.userId, formData).subscribe((response) => {
              console.log(response);
              if (!!response) {
                this.workspaceService.get().subscribe((workspaces) => {
                  if (workspaces === undefined || workspaces.length <= 0) {
                    this.router.navigate(["/createWorkspace"], {state: {name: this.profileForm.value.name}})
                  } else {
                    this.router.navigate(['']);
                  }
                });

              }
            })
          } else {
            this.workspaceService.get().subscribe((workspaces) => {
              if (workspaces === undefined || workspaces.length <= 0) {
                this.router.navigate(["/createWorkspace"], {state: {name: this.profileForm.value.name}})
              } else {
                this.router.navigate(['']);
              }
            });
          }
        }
      });
    }
  }
}
