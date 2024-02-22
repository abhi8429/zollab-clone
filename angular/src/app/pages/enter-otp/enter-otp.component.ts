import {Component} from '@angular/core';
import {HttpStatusCode} from "@angular/common/http";
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../auth/auth.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.css']
})
export class EnterOtpComponent {
  email!: string;
  digitOne!: number;
  digitTwo!: number;
  digitThree!: number;
  digitFour!: number;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.email = navigation?.extras.state ? navigation.extras.state?.['email'] : '';
      });
  }

  submitOtp() {
    // call service to post otp
    if (!!this.digitOne && !!this.digitTwo && this.digitThree && !!this.digitFour) {
      const otp = this.digitOne + '' + this.digitTwo + '' + this.digitThree + '' + this.digitFour;
      this.userService.verifyOtp(this.email, otp).subscribe((response) => {
        if (response.status === HttpStatusCode.Ok) {
          this.router.navigate(['/resetPassword'], {state: {email: this.email, otp: otp}})
        }
      });
    }
  }
}
