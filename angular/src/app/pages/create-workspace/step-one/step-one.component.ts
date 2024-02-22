import { Component } from '@angular/core';
import {WorkspaceService} from "../../../services/workspace.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css']
})
export class StepOneComponent {
  workspaceName! : string;
  userId! : number;

  constructor(private workspaceService: WorkspaceService,
              private router: Router) {}

  onSubmit() {
    if(!!this.workspaceName) {
      this.workspaceService.create(this.workspaceName, this.userId).subscribe((response) => {
        if(!!response) {
          this.router.navigate(['/CreateWorkspaceStepTwo'], {state : {workspace: response}});
        }
      });
    }
  }
}
