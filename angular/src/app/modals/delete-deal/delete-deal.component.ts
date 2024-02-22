import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Deal} from "../../model/deal";
import {DealService} from "../../services/deal.service";
import {Workspace} from "../../model/workspace";

@Component({
  selector: 'app-delete-deal',
  templateUrl: './delete-deal.component.html',
  styleUrls: ['./delete-deal.component.css']
})
export class DeleteDealComponent {
  @Input() deal!: Deal;
  @Input() workspace!: Workspace;
  constructor(public activeModal: NgbActiveModal, private dealService: DealService) {
  }

  delete() {
    this.deal.deleted = true;
    this.dealService.update(this.workspace.id!, this.deal.id!, this.deal).subscribe((response) => {
      if(!!response) {
        this.activeModal.close({deleted: true})
      }
    })
  }
}
