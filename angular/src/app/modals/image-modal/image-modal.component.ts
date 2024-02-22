import { Component, Input, OnInit } from '@angular/core';
import { Team } from "../../model/team";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  @Input() receivedData: any = [];
  imageUrlToRender: any;
  constructor(private activeModal: NgbActiveModal) {
  }
  ngOnInit(): void {
    this.imageUrlToRender = this.receivedData.key;
    console.log("imageUrlToRender---" + this.imageUrlToRender)
  }

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({ team })
    }
    else {
      this.activeModal.close();
    }
  }

  downloadImage(): void {
    fetch(this.imageUrlToRender)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'downloaded-image.jpg'; // Set the desired file name

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      });
  }
  
}
