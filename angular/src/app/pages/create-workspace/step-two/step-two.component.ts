import {Component} from '@angular/core';
import {WorkspaceService} from "../../../services/workspace.service";
import {debounceTime, distinctUntilChanged, filter, Observable, switchMap} from "rxjs";
import {UserService} from "../../../services/user.service";
import {User} from "../../../model/user";
import {NavigationEnd, Router} from "@angular/router";
import {Workspace} from "../../../model/workspace";
import {HttpStatusCode} from "@angular/common/http";
import {Role} from "../../../model/role";
import {RoleService} from "../../../services/role.service";

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent {
  user!: User;
  workspace!: Workspace;
  workspaceRoles: Role[] | undefined;
  selectedRole: any;
  constructor(private workspaceService: WorkspaceService,private userService: UserService, private router: Router,
              private roleService: RoleService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.workspace = navigation?.extras.state ? navigation.extras.state?.['workspace'] : undefined;
        this.getRoles();
      });
  }

  search = (text: Observable<string>) => {
    return text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchText) =>
        searchText.length >= 4 ? this.userService.searchUser(searchText) : []
      )
    );
  }
  formatter = (x: { email: string }) => x.email;

  inviteMember() {
    let member: any = {};
    member = {
      role : {
        roleName: this.selectedRole
      },
    }
    if(this.user.id) {
      member.memberId = this.user.id;
    } else if(this.user) {
      member.memberName = this.user;
      member.memberEmail = this.user;
    } else {
      return;
    }
    this.workspaceService.invite(this.workspace!.id!, member).subscribe((response) => {
      console.log(response);
      if(response.status === HttpStatusCode.Ok) {
        this.router.navigate(['/']);
        //this.activeModal.close({membersInvited: true});
      }
    })
  }

  getRoles() {
    this.roleService.getRoles(this.workspace.id!).subscribe((response) => {
      this.workspaceRoles = response;
      this.selectedRole =  response[0].roleName;
    })
  }
}
