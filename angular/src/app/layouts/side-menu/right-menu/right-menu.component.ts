import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Workspace} from "../../../model/workspace";

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.css']
})
export class RightMenuComponent {
  @Output() hideRightMenu = new EventEmitter<boolean>();
  @Input() hideRightBar!: boolean;
  @Input() workspace!: Workspace;

  hideMenu() {
    this.hideRightBar = !this.hideRightBar;
    this.hideRightMenu.emit(this.hideRightBar)
  }
}
