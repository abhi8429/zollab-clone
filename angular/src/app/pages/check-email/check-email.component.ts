import {Component, EventEmitter} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs";
import {UserService} from "../../services/user.service";
import {HttpClient, HttpResponse, HttpResponseBase, HttpStatusCode} from "@angular/common/http";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-check-email',
  templateUrl: './check-email.component.html',
  styleUrls: ['./check-email.component.css']
})
export class CheckEmailComponent {
  email!: string;
  userId!: number;
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
        this.userId = navigation?.extras.state ? navigation.extras.state?.['userId'] : '';
    });
  }

  onDigitInput(event: any){
    let element;
    if (event.code !== 'Backspace')
      element = event.target.nextElementSibling;
    if (event.code === 'Backspace')
      element = event.target.previousElementSibling;
    if(event.target.nextElementSibling == null) {
      // call service to post otp
      if(!!this.digitOne && !!this.digitTwo && this.digitThree && !!this.digitFour) {
        const otp = this.digitOne + '' + this.digitTwo + '' + this.digitThree + '' + this.digitFour;
        this.userService.submitOtp(this.email, this.userId, otp).subscribe((response) => {
          if(response.status === HttpStatusCode.Ok) {
            this.authService.login(this.email, this.email).subscribe((data) => {
                console.log('Auth', data);
            });
            this.router.navigate(['/SetUpProfile'],{ state: { email: this.email, userId: this.userId}})
          }
        });
      } else {
        return;
      }
    } else if(element == null)
      return;
    else
      element.focus();
  }
}
