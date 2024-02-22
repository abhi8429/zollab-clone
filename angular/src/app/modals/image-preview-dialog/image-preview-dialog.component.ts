import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.css'],
})
export class ImagePreviewDialogComponent implements OnInit{
  
  @Input() receivedData: { key: string } = { key: '' };
  @Input() contentType: any;
  data=''
  constructor(private activeModal: NgbActiveModal) {
   
  }
  ngOnInit(): void {
    this.data=this.receivedData.key;
    console.log('imgUrl---'+this.data)
    console.log("contentType000---"+this.contentType)
  }
  
  close(){
    this.activeModal.dismiss();
  }
}