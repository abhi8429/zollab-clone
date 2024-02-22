import {Component} from '@angular/core';
import {DealService} from "../../services/deal.service";
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {Workspace} from "../../model/workspace";
import {Deal, DealList, FilterMeta} from "../../model/deal";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.css']
})
export class DealComponent {
  deals!: DealList;
  workspaceSettings!: boolean;
  selectedWorkspace!: Workspace;
  hideLeftMenu: boolean = true;
  selectedPage!: number;
  filterMeta: FilterMeta | undefined;
  filterSummary!: string;
  filterTags = '';
  filterStatus = '';
  filterSort = '';
  showUploadProgress = false;
  percentageUpload: number = 0;

  constructor(private dealService: DealService, private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.getDeals(0);
        this.getFilterMeta();
      });
  }

  getDeals(page: number) {
    this.dealService.get(this.selectedWorkspace.id!, page).subscribe((response) => {
      this.deals =  response;
      this.selectedPage = page;
    })
  }

  updateWorkspace(workspace: Workspace) {
    this.selectedWorkspace = workspace;
    this.getDeals(0);
    this.getFilterMeta();
  }

  showDealDropdown(deal: Deal) {
    const dealDropdown = document.getElementById('dropdown_'+ deal.id) as HTMLElement;
    dealDropdown.classList.add('show');
  }

  getFilterMeta() {
    this.dealService.getDealMeta(this.selectedWorkspace.id!).subscribe((response) => {
      this.filterMeta = response;
    })
  }

  searchDeals() {
    this.dealService.get(this.selectedWorkspace.id!, 0, this.filterSummary, this.filterTags, this.filterStatus, this.filterSort).subscribe((response) => {
      this.deals =  response;
      this.selectedPage = 0;
    })
  }

  sortDeals() {
    this.searchDeals();
  }

  uploadDocument(event: any) {
    const file: File =  event.target.files[0];
    event.target.value = "";
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.showUploadProgress = true;
    this.dealService.uploadDocument(this.selectedWorkspace.id!, formData).subscribe((response) => {
      console.log(response);
      switch (response.type){
        case HttpEventType.UploadProgress:
          if(response?.loaded && response?.total) {
            this.percentageUpload = Math.round(response.loaded / response.total * 100);
            console.log('Uploaded!', this.percentageUpload);
          }
          break;
        case HttpEventType.Response:
          if(isDeal(response.body)) {
            this.router.navigate(['/editDeal'], { state: { selectedWorkspace: this.selectedWorkspace, selectedDeal: response.body}});
          }
          this.showUploadProgress = false;
          break;
      }
    }, error => {
      this.showUploadProgress = false;
    });
  }
}

const isDeal = (deal: any): deal is Deal => (deal as Deal).id !== undefined;
