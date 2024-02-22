import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string | undefined
  constructor(private userService: UserService,
              private router: Router) {
  }

  sendOtp() {
    if(!!this.email) {
      this.userService.sendOtp(this.email).subscribe((response) => {
        if(response.status === HttpStatusCode.Ok) {
          this.router.navigate(['enterOtp'], {state: {email: this.email}});
        }
      })
    }
  }
}
