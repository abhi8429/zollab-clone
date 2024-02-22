import {Component} from '@angular/core';
import {HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {AuthService} from "../../../auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  showPass1: boolean = false;
  showPass2: boolean = false;

  private userId: number;
  constructor(private userService: UserService,
              public fb: FormBuilder,
              authService: AuthService,
              public jwtHelper: JwtHelperService,
              private router: Router) {
    const accessToken = authService.getAccessToken();
    this.userId = jwtHelper.decodeToken(accessToken).id;
  }

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required]
  });

  changePassword() {
    alert(this.passwordForm.value)
    if(this.passwordForm.valid) {
      this.userService.updatePassword(this.userId, this.passwordForm.controls.newPassword.value!, this.passwordForm.controls.oldPassword.value!).subscribe((response) => {
        if (response.status === HttpStatusCode.Ok) {
          this.router.navigate(['/profileSettings'])
        }
      });
    }
  }
}
