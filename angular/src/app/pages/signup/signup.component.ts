import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email!: string;
  constructor(private userService: UserService,
              private router: Router) {
  }
  signUp() {
    this.userService.signup(this.email).subscribe((user) => {
      if (!!user) {
        this.router.navigate(['checkEmail'], { state: { email: this.email, userId: user.id}});
      }
    });
  }

  signInWithGoogle(): void {
    window.location.href = `${environment.baseUrl}/identity/oauth2/authorization/google`;
  }
}
