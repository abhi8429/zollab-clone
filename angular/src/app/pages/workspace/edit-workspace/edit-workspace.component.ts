import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {WorkspaceService} from "../../../services/workspace.service";
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {Workspace} from "../../../model/workspace";

@Component({
  selector: 'app-edit-workspace',
  templateUrl: './edit-workspace.component.html',
  styleUrls: ['./edit-workspace.component.css']
})
export class EditWorkspaceComponent {
  selectedWorkspace!: Workspace;
  imageUrl: any = 'assets/img/profile-add-up-white-arrow.png';
  editFile: boolean = true;
  removeUpload: boolean = false;
  @ViewChild('fileInput') el!: ElementRef;
  workspaceImage: File | undefined;

  constructor(private workspaceService: WorkspaceService,
              private router: Router,
              private cd: ChangeDetectorRef) {
    // this.workspace = this.router.getCurrentNavigation()?.extras.state?.['workspace'];
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation  = this.router.getCurrentNavigation();
        this.selectedWorkspace = navigation?.extras.state ? navigation.extras.state?.['selectedWorkspace'] : undefined;
        this.imageUrl = !!this.selectedWorkspace.workspaceLogo ? this.selectedWorkspace.workspaceLogo : this.imageUrl;
      });
  }

  update() {
    if(!!this.workspaceImage) {
      this.uploadWorkspaceImage();
    }
    this.workspaceService.update(this.selectedWorkspace).subscribe((response)=> {
      console.log(response);
      /*if(!!this.workspaceImage) {
        this.uploadWorkspaceImage();
      }*/
    });
  }

  uploadFile(event: any) {
    let reader = new FileReader();
    let file: File = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editFile = false;
        this.removeUpload = true;
      }
      this.workspaceImage = file;
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'assets/img/profile-add-up-white-arrow.png';
    this.editFile = true;
    this.removeUpload = false;
    this.workspaceImage = undefined;
  }

  private uploadWorkspaceImage() {
    const formData = new FormData();
    formData.append('file', this.workspaceImage!, this.workspaceImage!.name);
    this.workspaceService.updateImage(this.selectedWorkspace.id!, formData).subscribe((response) => {
      console.log('workspaceImage', response);
    });
  }
}
