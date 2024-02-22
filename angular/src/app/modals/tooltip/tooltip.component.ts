import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectService} from "../../services/project.service";
import {TeamService} from "../../services/team.service";
import {Router} from "@angular/router";
import {CreateProjectDeliverableService} from "../../services/create-project-deliverable.service";
// import {Clipboard} from "@angular/cdk/clipboard";
// import {ClipboardModule} from "ngx-clipboard";

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent {

  contentFile: File | undefined;
  contentFileName: string = '';
  isDisplay:boolean=false;
  data: any;
  isHover: boolean = false;
  constructor(public activeModal: NgbActiveModal,
              private teamService: TeamService,
              private projectService: ProjectService,private router: Router,
              private createProjectDeliverableService: CreateProjectDeliverableService) {
  }

  uploadFile(event: any) {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      /*  reader.onload = () => {
          this.contentUrl = reader.result;
        }*/
      this.contentFile = file;
      this.contentFileName = file.name;
      this.router.navigate(['/tooltip-splash']);
      this.close(false);
      const formData = new FormData();
      formData.append('file', this.contentFile, this.contentFileName);
      this.projectService.createWithChatGpt(this.teamService.selectedTeam.id!, formData).subscribe((data) => {
        this.data = data;
        this.createProjectDeliverableService.setData(this.data);
      })
    }
  }

  hideAnimatedDiv() {
    this.isDisplay = true;
    this.isHover = false;
    setTimeout(() => {
      this.isDisplay = false;
    }, 500);
  }

  hoverEffect() {
    this.isHover = true;
  }

  mouseLeave() {
    this.isHover = false;
  }

  close(bool: boolean) {
    this.activeModal.close(bool);
  }
}
