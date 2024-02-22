import {Component} from '@angular/core';
import {Workspace} from "../../../../model/workspace";
import {WorkspaceService} from "../../../../services/workspace.service";
import {NavigationEnd, Router} from "@angular/router";
import {RoleService} from "../../../../services/role.service";
import {filter} from "rxjs";
import {RolePermission} from "../../../../model/role";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent {
  selectedWorkspace!: Workspace;
  roleName: string | undefined;
  roleDescription: string | undefined;
  rolePermission: RolePermission | undefined;

  constructor(private workspaceService: WorkspaceService,
              private router: Router,
              public fb: FormBuilder,
              private roleService: RoleService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
      });
  }

  permissionForm = this.fb.group({
    "MANAGE WORKSPACE": this.fb.array([
      this.fb.group({
        Workspaces: this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        Channels: this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        Members: this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        Roles: this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Direct Messaging": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Leave workspace": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        })
      })
    ]),
    "MANAGE DEALS": this.fb.array([
      this.fb.group({
        Deals: this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "All Deals": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deal status": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Linked deliverables": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
    ]),
    "MANAGE DELIVERABLES": this.fb.array([
      this.fb.group({
        Deliverable: this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "All deliverables": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deliverable status": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deliverable status - In progress": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deliverable status - In review": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deliverable status - Approved": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deliverable status - Changes needed": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Deliverable status - Done": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Evidence required list": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      }),
      this.fb.group({
        "Evidences": this.fb.group({
          read: [false],
          create: [false],
          update: [false],
          delete: [false],
        }),
      })
    ]),
  })

  createRole() {
    this.roleService.createRole(this.selectedWorkspace.id!, this.roleName!, this.roleDescription!).subscribe((response) => {
      if (!!response) {
        this.roleService.updateRolePermissions(this.selectedWorkspace.id!, response.id!, this.permissionForm.value).subscribe((response) => {
          if (!!response) {
            this.router.navigate(['roles'], {state: {selectedWorkspace: this.selectedWorkspace}});
          }
        });
      }
    })
  }
}
