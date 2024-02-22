import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ProjectDashboardComponent } from "./project-dashboard.component";
import { ProjectDashboardRoutingModule } from "./project-dashboard-routing.module";
import { FooterComponent } from "../footer/footer.component";

@NgModule({
    declarations: [ProjectDashboardComponent,FooterComponent],
    imports: [
      CommonModule,
      ProjectDashboardRoutingModule,
      FormsModule,
      NgbModule,    
      
    ],
    providers: [],
  })
  export class ProjectDashBoardModule { }