import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Team} from "../../model/team";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

constructor(private activeModal:NgbActiveModal) {
}

  close(team: Team | null) {
    if (team) {
      this.activeModal.close({team});
    } else {
      this.activeModal.close();
    }
  }
}
