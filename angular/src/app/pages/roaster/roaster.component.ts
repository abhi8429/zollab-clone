import {Component} from '@angular/core';
import {Workspace} from "../../model/workspace";
import {RosterService} from "../../services/roster.service";
import {Roster} from "../../model/roster";
import {Profile} from "../../model/roster-profile";
import {ProfileList} from "../../model/profile-list";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ShareRosterComponent} from "../../modals/share-roster/share-roster.component";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-roaster',
  templateUrl: './roaster.component.html',
  styleUrls: ['./roaster.component.css']
})
export class RoasterComponent {
  selectedWorkspace!: Workspace;
  hideLeftMenu: boolean = true;
  rosters!: Roster[];
  keyword: string = '';
  profiles: Profile | undefined;
  rosterProfiles: ProfileList | undefined;
  showCreateRoster: boolean = false;
  newRosterName: string | undefined;
  showAddToRoster: boolean = false;
  selectedRoster: Roster | undefined;
  masterSelected = false;

  constructor(private roasterService: RosterService, private dialog: NgbModal) {
    this.getRoasters();
    if(!!this.rosters && this.rosters.length > 0) {
      this.getProfiles(this.rosters[0]);
    }
  }

  getRoasters() {
    this.roasterService.getRosters().subscribe((response) => {
      this.rosters = response;
    })
  }

  updateWorkspace(workspace: Workspace) {
    this.selectedWorkspace = workspace;
  }


  searchProfiles() {
    this.roasterService.search(this.keyword).subscribe((response) => {
      this.profiles = response;
    })
  }

  goToLink(url: string | undefined){
    if(!!url)
      window.open(url, "_blank");
  }

  getProfiles(roster: Roster | undefined) {
    if(!!roster) {
      this.selectedRoster = roster;
      this.roasterService.getRosterProfile(roster.id!).subscribe((response) => {
        this.rosterProfiles = response;
      });
    }
  }
  createAndAddToRoster() {
    if (!!this.newRosterName) {
      this.roasterService.createRoster(this.newRosterName!).subscribe((response) => {
        if(!!response) {
          this.rosters.push(response)
          // add this user to roster.
          this.addProfileToRoster([response.id!]);
        }
        this.showCreateRoster = false;
        this.showAddToRoster = false;
      });
    }
  }

  addProfileToRoster(value: number[]) {
    this.roasterService.addProfileToRoster(value, this.profiles?.id!).subscribe((response) => {
      const roster = this.rosters.find((r: Roster) => r.id === +value);
      this.selectedRoster = roster;
      this.getProfiles(roster);
    });
    this.showCreateRoster = false;
    this.showAddToRoster = false;
  }

  removeProfileFromRoster(profile: Profile) {
    this.roasterService.removeProfileFromRoster(this.selectedRoster?.id!, profile.id!).subscribe((response) => {
      if(response.status === HttpStatusCode.Ok) {
        this.getProfiles(this.selectedRoster);
      }
    });
  }

  share() {
    const modalRef = this.dialog.open(ShareRosterComponent);
    modalRef.componentInstance.roster = this.selectedRoster;
    modalRef.result.then((result) => {
      /*if(result.deleted) {
        this.router.navigate(['/deals'], { state: { selectedWorkspace: this.selectedWorkspace}})
      }*/
    })
  }

  saveNotes(profiles: Profile, notes: string) {
    this.roasterService.addNotes(this.selectedRoster?.id!, profiles.id!, notes).subscribe((response) => {
      const notes = document.getElementById('notes_' + profiles.id) as HTMLElement;
      notes.classList.remove('show')
    });
  }

  openEllipseDrop(id: number | undefined) {
    const dealDropdown = document.getElementById('ellipse_' + id) as HTMLElement;
    const removeProfile = document.getElementById('removeProfile_' + id) as HTMLElement;
    const notes = document.getElementById('notes_' + id) as HTMLElement;
    removeProfile.classList.remove('show')
    notes.classList.remove('show')
    if(!dealDropdown.classList.contains('show'))
      dealDropdown.classList.add('show');
    else
      dealDropdown.classList.remove('show');
  }

  toggleNotes(id: number | undefined) {
    const dealDropdown = document.getElementById('notes_' + id) as HTMLElement;
    const removeProfile = document.getElementById('removeProfile_' + id) as HTMLElement;
    removeProfile.classList.remove('show')
    if(!dealDropdown.classList.contains('show'))
      dealDropdown.classList.add('show');
    else
      dealDropdown.classList.remove('show');
  }

  toggleRemoveProfile(id: number | undefined) {
    const removeProfile = document.getElementById('removeProfile_' + id) as HTMLElement;
    const notes = document.getElementById('notes_' + id) as HTMLElement;
    notes.classList.remove('show')
    if(!removeProfile.classList.contains('show'))
      removeProfile.classList.add('show');
    else
      removeProfile.classList.remove('show');
  }

  checkUncheckAll() {
    for (let i = 0; i < this.rosters.length; i++) {
      this.rosters[i].isSelected = this.masterSelected;
    }
  }
  isAllSelected() {
    this.masterSelected = this.rosters.every(function(item:any) {
      return item.isSelected == true;
    })
  }

  getCheckedItemList(){
    const checkedList: Roster[] = [];
    for (var i = 0; i < this.rosters.length; i++) {
      if(this.rosters[i].isSelected)
        checkedList.push(this.rosters[i]);
    }
    return checkedList
  }

  addProfilesToRoster() {
    const checkedList = this.getCheckedItemList();
    if(checkedList !== undefined && checkedList.length > 0) {
      let rosterIds: number[] = [];
      checkedList.forEach((roster) => {
        rosterIds.push(roster.id!)
      })
      this.addProfileToRoster(rosterIds);
    }
  }
}

