import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {WorkspaceService} from "../../services/workspace.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreateTeamComponent} from "../../modals/create-team/create-team.component";
import {TeamService} from "../../services/team.service";

@Component({
  selector: 'app-signin2',
  templateUrl: './signin2.component.html',
  styleUrls: ['./signin2.component.css']
})
export class Signin2Component implements OnInit {

  submitted: boolean = false;
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, this.emailSuffixValidator]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private teamService: TeamService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private jwtHelper: JwtHelperService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    private dialog: NgbModal
  ) {
    if (authService.isLoggedIn) {
      this.router.navigate(['project-dashboard']);
    }
  }

  emailSuffixValidator(control: FormControl) {
    const email = control.value as string;
    if (email && !/.{2,}\..{2,}/.test(email)) {
      return { invalidSuffix: true };
    }
    return null;
  }
  ngOnInit(): void {
    this.submitted = false;
  }

  protected get registerFormControl() {
    return this.signinForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    if (!this.signinForm.valid) {
      console.log('Invalid Form')
      return;
    } else {
      //Authorize
      this.authService.login(this.signinForm.controls.email.value!, this.signinForm.controls.password.value!)
        .subscribe((data) => {
          this.userService.getUserProfile(data.body.id).subscribe((user) => {
            this.localStorageService.store('user', user);
            this.router.navigate(['project-dashboard']);
          })
        });
    }
  }

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

}
