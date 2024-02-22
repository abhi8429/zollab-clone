import {Component} from '@angular/core';
import {RosterService} from "../../../services/roster.service";
import {ActivatedRoute} from "@angular/router";
import {PublicRoster} from "../../../model/roster";

@Component({
  selector: 'app-roaster-view-link',
  templateUrl: './roaster-view-link.component.html',
  styleUrls: ['./roaster-view-link.component.css']
})
export class RoasterViewLinkComponent {
  profileDetails: PublicRoster | undefined;

  constructor(private rosterService: RosterService,  private activatedRoute: ActivatedRoute) {
    const encodedInviteCode = this.activatedRoute.snapshot.paramMap.get('encodedInviteCode');
    if(!!encodedInviteCode) {
      this.getDetails(encodedInviteCode);
    }
  }


  getDetails(encodedInviteCode: string) {
    this.rosterService.getPublicRosterDetails(encodedInviteCode).subscribe((response) => {
      this.profileDetails = response;
    })
  }
}
