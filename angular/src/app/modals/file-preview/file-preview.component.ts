import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DraftPost} from "../../model/deliverable";

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilePreviewComponent {
  @Input() file!: File;
  @Input() post!: DraftPost;
  URL = URL;

  constructor(public activeModal: NgbActiveModal) {

  }


}
