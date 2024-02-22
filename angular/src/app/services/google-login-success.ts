import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalStorageService } from "ngx-webstorage";
import { CreateTeamComponent } from "../modals/create-team/create-team.component";
import { ActivatedRoute, Router } from "@angular/router";
import { TeamService } from "./team.service";

@Injectable({
    providedIn: 'root'
})
export class GoogleLoginSuccessService {
    constructor(private authService: AuthService,
        private userService: UserService,private activatedRoute: ActivatedRoute,
        private jwtHelper: JwtHelperService, private localStorageService: LocalStorageService,
        private dialog: NgbModal,private router: Router, private teamService: TeamService) {
            
            const token: string | null = this.activatedRoute.snapshot.queryParamMap.get('token');
            if(!!token) {
                this.authService.saveAccessToken(token);
                if(this.authService.isLoggedIn) {
                  const payload = this.jwtHelper.decodeToken(token);
                  console.log("--payload---"+payload.id)
                  this.userService.getUserProfile(payload.id).subscribe((user) => {
                    console.log("user--------"+user.email)
                    this.localStorageService.store('user', user);
                    var teamList:any =this.teamService.getAll();
                    if(teamList && teamList[0])
                        this.teamService.setSelectedTeam(teamList[0]);
                   
                    // const modalRef = this.dialog.open(CreateTeamComponent);
                    this.removeUrlParam();
                  })
                  this.router.navigate(['/'])
                }
              }
              console.log("token-----"+token)
             
    }
    storeGoogleLoginTokenToSession1() {
        // 1. Check if there's a JSESSIONID token in the URL after redirection from Google
        const urlParams = new URLSearchParams(window.location.search);
        const jSessionIdFromUrl = urlParams.get('token');
        const jSessionRefreshIdFromUrl = urlParams.get('refresh');

        
        if (jSessionIdFromUrl) {
            this.removeUrlParam();
            // 2. If found, extract the token from the URL and store it in the localStorage as well
            // localStorage.setItem('access_token', jSessionIdFromUrl);
            // localStorage.setItem('refresh_token', jSessionIdFromUrl);
            
            this.authService.saveAccessToken(jSessionIdFromUrl);
            if (this.authService.isLoggedIn) {
                const payload = this.jwtHelper.decodeToken(jSessionIdFromUrl);
                this.userService.getUserProfile(payload.id).subscribe((user) => {
                    this.localStorageService.store('user', user);
                    const modalRef = this.dialog.open(CreateTeamComponent);
                })
            }
        }
        if (jSessionRefreshIdFromUrl) {
            this.removeUrlParam();
            // 2. If found, extract the token from the URL and store it in the localStorage as well
            // localStorage.setItem('access_token', jSessionRefreshIdFromUrl);
            // localStorage.setItem('refresh_token', jSessionRefreshIdFromUrl);
            
            this.authService.saveAccessToken(jSessionRefreshIdFromUrl);
            if (this.authService.isLoggedIn) {
                const payload = this.jwtHelper.decodeToken(jSessionRefreshIdFromUrl);
                this.userService.getUserProfile(payload.id).subscribe((user) => {
                    this.localStorageService.store('user', user);
                    // const modalRef = this.dialog.open(CreateTeamComponent);
                })
            }
        }
    }

    removeUrlParam() {
        // Get the current URL
        const url = new URL(window.location.href);

        // Remove the 'token' parameter
        url.searchParams.delete('token');
        url.searchParams.delete('newUser');
        url.searchParams.delete('refresh');
        // Replace the current URL without causing a page reload
        window.history.replaceState({}, document.title, url.toString());

    }

    getJSessionIdFromCookie() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'JSESSIONID') {
                return value;
            }
        }
        return null; // Return null if JSESSIONID cookie is not found
    }
}
