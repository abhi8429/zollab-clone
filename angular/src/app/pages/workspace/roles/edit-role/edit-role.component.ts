import {Component} from '@angular/core';
import {Workspace} from "../../../../model/workspace";
import {WorkspaceService} from "../../../../services/workspace.service";
import {NavigationEnd, Router} from "@angular/router";
import {RoleService} from "../../../../services/role.service";
import {filter} from "rxjs";
import {Role, RolePermission} from "../../../../model/role";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent {
  selectedWorkspace!: Workspace;
  selectedRole!: Role;
  permissions : RolePermission | undefined;

  constructor(private workspaceService: WorkspaceService,
              private router: Router,
              public fb: FormBuilder,
              private roleService: RoleService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.selectedRole = navigation?.extras.state ? navigation.extras.state?.['selectedRole'] : undefined;
        this.getRolePermissions();
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

  getRolePermissions() {
    this.roleService.getRolePermissions(this.selectedWorkspace.id!,this.selectedRole.id!).subscribe((response) => {
      this.permissions = response;
      this.patchForm();
    });
  }

  get line(): FormGroup {
    return this.fb.group({
      read: [false],
      create: [false],
      update: [false],
      delete: [false],
    });
  }

  patchForm() {

    // @ts-ignore
    this.permissionForm.patchValue(this.permissions);
   /* for (let line=0; line < this.permissions?.["MANAGE WORKSPACE"]?.length; line++){
      const linesFormArray = this.permissionForm.get("MANAGE WORKSPACE") as FormArray;
      const playersFormsArray = linesFormArray.at(line).get("Workspaces") as FormGroup;
      // if(!!playersFormsArray)
      // this.line.patchValue(this.permissions?.["MANAGE WORKSPACE"]?.at(line).);
      // console.log('-----------+++++++linesFormArray+++++--------', linesFormArray);
      // console.log('-----------++++++++++++--------', linesFormArray.at(line)?.get('Workspaces'));
      // console.log('----------------------',this.permissions?.
     // ["MANAGE WORKSPACE"]?.at(line));
      linesFormArray.push(this.permissions?.["MANAGE WORKSPACE"]?.at(line));
    }*/

    /*this.permissionForm.patchValue({
      "MANAGE WORKSPACE": {
        Workspaces: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        Channels: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        Members: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        Roles: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Direct Messaging": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Leave workspace": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
      },
      "MANAGE DEALS": {
        Workspaces: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "All Deals": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        Deals: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deal status": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Linked deliverables": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
      },
      "MANAGE DELIVERABLES": {
        "All deliverables": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        Deliverable: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Evidence required list": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        Evidences: {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deliverable status": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deliverable status - Approved": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deliverable status - Changes needed": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deliverable status - In progress": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deliverable status - In review": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
        "Deliverable status - Done": {
          read: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.read,
          create: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.create,
          update: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.update,
          delete: this.permissions?.["MANAGE WORKSPACE"]?.[0].Workspaces?.delete,
        },
      }
    })*/

  }

  updateRole() {
    this.roleService.updateRole(this.selectedWorkspace.id!, this.selectedRole.id!, this.selectedRole.roleName!, this.selectedRole.roleDesc!).subscribe((response) => {
      if(!!response) {
        this.roleService.updateRolePermissions(this.selectedWorkspace.id!, response.id!, this.permissionForm.value).subscribe((response) => {
          if(!!response) {
            this.router.navigate(['roles'], { state: { selectedWorkspace: this.selectedWorkspace}});
          }
        });
      }
    })
  }
}
