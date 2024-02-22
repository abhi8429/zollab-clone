import {Component} from '@angular/core';
import {WorkspaceService} from "../../../services/workspace.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {Workspace} from "../../../model/workspace";
import {RoleService} from "../../../services/role.service";
import {Role} from "../../../model/role";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  roles : Role[] | undefined
  selectedWorkspace!: Workspace;
  constructor(private workspaceService: WorkspaceService,
              private router: Router,
              private roleService: RoleService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.getRoles();
      });
  }

  getRoles() {
    this.roleService.getRoles(this.selectedWorkspace.id!).subscribe((response) => {
      this.roles = response;
    })
  }

  showRoleDropdown(role: Role) {
    const dealDropdown = document.getElementById('dropdown_'+ role.id) as HTMLElement;
    dealDropdown.classList.add('show');
  }
}
