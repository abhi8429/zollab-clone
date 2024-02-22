import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Report} from "../../model/report";
import {DeliverableService} from "../../services/deliverable.service";
import {userObj} from "../../model/deliverable";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  @Input() report!: Report;
  @Input() workspaceId!: number;
  @Input() dealId!: number;
  @Input() deliverableId!: number;
  @Input() creator!: userObj;
  constructor(public activeModal: NgbActiveModal, private deliverableService: DeliverableService) {
    console.log(this.creator);
  }

  downloadReport() {
    this.deliverableService.downloadReport(this.workspaceId!, this.dealId!, this.deliverableId).subscribe((response) => {
      const file = new Blob([response.body], { type: 'application/octet-stream' });
      const fileURL = URL.createObjectURL(file);
      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = response.headers.get('Content-Disposition').split(';')[1]
        .split('filename')[1].split('=')[1].trim().replace(/\"/g, '');
      link.click();
    })
  }
}
