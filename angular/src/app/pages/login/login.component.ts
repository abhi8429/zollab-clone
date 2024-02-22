import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {WorkspaceService} from "../../services/workspace.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private submitted!: boolean;
  showPass: boolean = false;
  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private jwtHelper: JwtHelperService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
  ) {
    const token: string | null = this.activatedRoute.snapshot.queryParamMap.get('token');
    if(!!token) {
      authService.saveAccessToken(token);
      if(authService.isLoggedIn) {
        this.workspaceService.get().subscribe((workspaces) => {
          const payload = jwtHelper.decodeToken(token);
          if(workspaces === undefined || workspaces.length <= 0) {
            this.router.navigate(['SetUpProfile'], { state: { email: payload.email, userId: payload.id}});
          } else {
            this.userService.getUserProfile(payload.id).subscribe((user) => {
              this.localStorageService.store('user', user);
              this.router.navigate(['']);
            })
          }
        });
      }
    }
    if(authService.isLoggedIn) {
      this.router.navigate(['']);
    }
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  onSubmit() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      console.log('Invalid Form')
      return;
    } else {
      this.authService.login(this.loginForm.controls.email.value!, this.loginForm.controls.password.value!).subscribe((data) => {
        this.userService.getUserProfile(data.body.id).subscribe((user) => {
          this.localStorageService.store('user', user);
          const encodedDealInviteCode = this.sessionStorageService.retrieve('invitedDeal');
          const encodedDeliverableInviteCode = this.sessionStorageService.retrieve('invitedDeliverable');
          const encodedWorkspaceInviteCode = this.sessionStorageService.retrieve('invitedWorkspace');
          if(!!encodedDealInviteCode) {
            this.sessionStorageService.clear('invitedDeal');
            this.router.navigate(['deals/'+ encodedDealInviteCode]);
          } else if(!!encodedDeliverableInviteCode) {
            this.sessionStorageService.clear('invitedDeliverable');
            this.router.navigate(['deliverables/'+ encodedDeliverableInviteCode]);
          } else if(!!encodedWorkspaceInviteCode) {
            this.sessionStorageService.clear('invitedWorkspace');
            this.router.navigate(['ws/'+ encodedWorkspaceInviteCode]);
          } else {
            this.router.navigate([''])
          }
        })
      });
    }
  }

  signInWithGoogle(): void {
    window.location.href = "https://devdeal.stella.so/identity/oauth2/authorization/google";
  }
}
