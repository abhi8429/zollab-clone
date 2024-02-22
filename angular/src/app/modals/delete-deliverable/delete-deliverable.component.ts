import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Workspace} from "../../model/workspace";
import {Deliverable} from "../../model/deliverable";
import {DeliverableService} from "../../services/deliverable.service";

@Component({
  selector: 'app-delete-deal',
  templateUrl: './delete-deliverable.component.html',
  styleUrls: ['./delete-deliverable.component.css']
})
export class DeleteDeliverableComponent {
  @Input() deliverable!: Deliverable;
  @Input() workspace!: Workspace;
  constructor(public activeModal: NgbActiveModal, private deliverableService: DeliverableService) {
  }

  delete() {
    this.deliverableService.delete(this.workspace.id!, this.deliverable.idOfDeal!, this.deliverable.id!).subscribe((response) => {
      if(!!response) {
        this.activeModal.close({deleted: true})
      }
    })
  }
}
