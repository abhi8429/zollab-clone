import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDashBoardModule } from './project-dashboard.module';
import { ProjectDashboardComponent } from './project-dashboard.component';


const routes: Routes = [{ path: '', component: ProjectDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectDashboardRoutingModule { }
