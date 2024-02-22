import {Component} from '@angular/core';
import {Workspace} from "../../model/workspace";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {DeliverableService} from "../../services/deliverable.service";
import {DeliverableList, FilterMeta} from "../../model/deliverable";

@Component({
  selector: 'app-deliverable',
  templateUrl: './deliverable.component.html',
  styleUrls: ['./deliverable.component.css']
})
export class DeliverableComponent {
  selectedWorkspace!: Workspace;
  hideLeftMenu: boolean = true;
  deliverables!: DeliverableList;
  selectedPage!: number;

  filterMeta: FilterMeta | undefined;
  filterSummary!: string;
  filterCreator = '';
  filterDue = '';
  filterStatus = '';

  constructor(private deliverableService: DeliverableService, private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.getWorkspaceDeliverables(0);
        this.getFilterMeta();
      });

  }

  getWorkspaceDeliverables(page: number) {
    this.deliverableService.getWorkspaceDeliverables(this.selectedWorkspace.id!, page).subscribe((response) => {
      this.deliverables = response;
      this.selectedPage = page;
    })
  }
  updateWorkspace(workspace: Workspace) {
    this.selectedWorkspace = workspace;
    this.getWorkspaceDeliverables(0);
    this.getFilterMeta();
  }

  getFilterMeta() {
    this.deliverableService.getDeliverableMeta(this.selectedWorkspace.id!).subscribe((response) => {
      this.filterMeta = response;
    })
  }

  searchDeliverable() {
    this.deliverableService.getWorkspaceDeliverables(this.selectedWorkspace.id!, 0, this.filterSummary, this.filterDue, this.filterStatus,  this.filterCreator).subscribe((response) => {
      this.deliverables =  response;
      this.selectedPage = 0;
    })
  }

  showChilds(id: number) {
    const divs = document.querySelectorAll("[id=" + 'deliverable_' + id + "]");
    divs.forEach((div: any) => {
      if(div.style.display === 'none' || div.style.display === '')
        div.style.display = 'block';
      else
        div.style.display = 'none';
    })

  }
}
