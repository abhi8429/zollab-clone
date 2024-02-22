import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkspaceService} from "../../../services/workspace.service";
import {AuthService} from "../../../auth/auth.service";
import {Router} from "@angular/router";
import {Workspace} from "../../../model/workspace";
import {SessionStorageService} from "ngx-webstorage";
import {User} from "../../../model/user";

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements AfterContentInit, OnInit {
  workspaces: Workspace[] = [];
  userSettings!: boolean;
  workspaceSettings!: boolean;
  @Output() hideLeftMenu = new EventEmitter<boolean>();
  @Output() selectedWorkspace = new EventEmitter<Workspace>();
  @Output() selectedType = new EventEmitter<string>();
  @Input() hideLeftBar!: boolean;
  user!: User;

  constructor(private workspaceService: WorkspaceService,
              private authService: AuthService,
              private router: Router, private storageService: SessionStorageService) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    console.log('LeftMenuComponent' , 'ngOnInit');
    }

  ngAfterContentInit(): void {
    console.log('LeftMenuComponent' , 'ngAfterContentInit');
    }

  ngAfterViewInit(): void {
    console.log('LeftMenuComponent' , 'ngAfterViewInit');
    this.init();
  }


  init(): void {
    this.workspaceService.get().subscribe((workspaces) => {
      this.workspaces = workspaces.sort((a, b) => a.name!.localeCompare(b.name!));
      if(this.storageService.retrieve("selectedWorkspace") === null) {
        this.storageService.store("selectedWorkspace", this.workspaces[0]);
        this.selectedWorkspace.emit(this.workspaces[0]);
      } else {
        this.selectedWorkspace.emit(this.storageService.retrieve("selectedWorkspace"));
      }
      this.hideLeftMenu.emit(this.hideLeftBar);
      this.selectedType.emit("WORKSPACE");
    })
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  hideMenu() {
    this.hideLeftBar = !this.hideLeftBar;
    this.hideLeftMenu.emit(this.hideLeftBar)
  }

  emitWorkspaceSelection(workspace: Workspace) {
    this.storageService.store("selectedWorkspace", workspace);
    this.selectedWorkspace.emit(workspace);
    this.selectedType.emit("WORKSPACE");
  }
}
