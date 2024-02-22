import { Component } from '@angular/core';
import {CreateTeamComponent} from "../../modals/create-team/create-team.component";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {WorkspaceService} from "../../services/workspace.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddChannelComponent} from "../../modals/add-channel/add-channel.component";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private workspaceService: WorkspaceService,
    private jwtHelper: JwtHelperService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    private dialog: NgbModal) {
    const token: string | null = this.activatedRoute.snapshot.queryParamMap.get('token');
    // const modalRef = this.dialog.open(CreateTeamComponent);
      if(!!token) {
        authService.saveAccessToken(token);
        if(authService.isLoggedIn) {
          const payload = jwtHelper.decodeToken(token);
          this.userService.getUserProfile(payload.id).subscribe((user) => {
            this.localStorageService.store('user', user);
            const modalRef = this.dialog.open(CreateTeamComponent);
          })
        }
      }
  }

  signInWithGoogle(): void {
    window.location.href = `${environment.baseUrl}/identity/oauth2/authorization/google`;
  }
}
