import { Component } from '@angular/core';
import {WorkspaceService} from "../../services/workspace.service";
import {FormBuilder} from "@angular/forms";
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.css']
})
export class CreateWorkspaceComponent {

  name: string | undefined;

  constructor( private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.name = navigation?.extras.state ? navigation.extras.state?.['name'] : '';
      });
  }

}
