import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {TeamService} from "../../services/team.service";
import {WorkspaceService} from "../../services/workspace.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {IdentityService} from "../../services/identity.service";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  password1: string = '';
  password2: string = '';
  formSubmitted: boolean = false;
  emailId: string | undefined;
  otpValue: string | null | undefined;
  errorMessage: string | undefined;
  constructor(private route: ActivatedRoute,
              public identityService: IdentityService,
              public router:Router) {}
  ngOnInit(): void {
    this.getData();
  }

  validatePasswordPattern(password: string): boolean {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = "";
    if (this.password1 === this.password2) {
      if (this.validatePasswordPattern(this.password1)) {
        this.changePassword();
      }
    }
  }

  changePassword(){
    this.identityService.changePassword({ email: this.emailId , otp : this.otpValue, confirmPassword: this.password2, newPassword: this.password1}).subscribe(() => {
        this.router.navigate(['/password-reset-success']);
      },
      (error) => {

      });
  }

  getData() {
    // @ts-ignore
    this.emailId  = localStorage.getItem('email');
    this.otpValue  = localStorage.getItem('otp');
  }
}
