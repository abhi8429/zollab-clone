import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";
import {TeamMember} from "../../model/team-member";

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent {

  @Input()
  text?: string;

  constructor(public  activeModal:NgbActiveModal) {
  }

  close(bool: boolean) {
    this.activeModal.close(bool);
  }
}
