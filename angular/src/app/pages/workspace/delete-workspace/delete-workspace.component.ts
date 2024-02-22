import {Component} from '@angular/core';
import {Workspace} from "../../../model/workspace";
import {WorkspaceService} from "../../../services/workspace.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-delete-workspace',
  templateUrl: './delete-workspace.component.html',
  styleUrls: ['./delete-workspace.component.css']
})
export class DeleteWorkspaceComponent {
  workspace!: Workspace;
  checkOne: boolean | undefined;
  checkTwo: boolean | undefined;

  constructor(private workspaceService: WorkspaceService,
              private router: Router) {
    // this.workspace = this.router.getCurrentNavigation()?.extras.state?.['workspace'];
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.workspace = navigation?.extras.state ? navigation.extras.state?.['workspace'] : undefined;
      });
  }

  update() {
    this.workspaceService.update(this.workspace).subscribe((response)=> {
      console.log(response);
    });
  }

  deleteWorkspace() {
    if(this.checkOne && this.checkTwo) {
      this.workspaceService.delete(this.workspace.id!).subscribe((response) => {
        this.router.navigate(['/'])
      });
    }
  }
}
