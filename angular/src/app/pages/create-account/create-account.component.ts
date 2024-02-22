import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {WorkspaceService} from "../../services/workspace.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  submitted: boolean = false;
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private jwtHelper: JwtHelperService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService) {
    if (authService.isLoggedIn) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.submitted = false;
  }

  protected get registerFormControl() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (!this.signupForm.valid) {
      return;
    } else {
      this.userService.signupWithEmailAndPwd(this.email?.value!, this.password?.value!).subscribe((user) => {
        this.authService.login(this.email?.value!, this.password?.value!)
          .subscribe((data) => {
            this.localStorageService.store('user', user);
            this.router.navigate(['project-dashboard']);
          });
      });
    }
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  signInWithGoogle(): void {
    window.location.href = `${environment.baseUrl}/identity/oauth2/authorization/google`;
  }
}
