import {Component, Input} from '@angular/core';
import {Workspace} from "../../model/workspace";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Member} from "../../model/member";
import {WorkspaceService} from "../../services/workspace.service";

@Component({
  selector: 'app-delete-member',
  templateUrl: './delete-member.component.html',
  styleUrls: ['./delete-member.component.css']
})
export class DeleteMemberComponent {

  @Input() member!: Member;
  @Input() workspace!: Workspace;
  constructor(public activeModal: NgbActiveModal, private workspaceService: WorkspaceService) {
  }

  delete() {
    this.workspaceService.removeMember(this.workspace.id!, this.member.memberId!).subscribe((response) => {
      if(!!response) {
        this.activeModal.close({deleted: true})
      }
    });
  }
}
