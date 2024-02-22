import {Component, OnInit, ViewChild,ElementRef, Renderer2} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TooltipComponent} from "../../modals/tooltip/tooltip.component";
import {Project, ProjectEmailContract} from "../../model/project";
import {FormArray, FormBuilder, NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectDeliverable} from "../../model/project-deliverable";
import {Team} from "../../model/team";
import {TeamService} from "../../services/team.service";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {ProjectEmailContractService} from "../../services/project-email-contract.service";
import {ProjectService} from "../../services/project.service";
import {CreateProjectDeliverableService} from "../../services/create-project-deliverable.service";
import {TooltipSplashComponent} from "../tooltip-splash/tooltip-splash.component";
import {RemoveFileComponent} from "../../modals/remove-file/remove-file.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  @ViewChild('projectForm') profileForm!: NgForm;
  team?: Team;
  teamImage?: string;
  project: Project = {
    paymentTerm: 'Once',
    firstUseExpiration: 'InPerpetuity',
    budgetPrivate: false,
    usageExpiration: true
  } as Project;
  paymentTerms: string[] = ['Once', 'Weekly', 'Monthly', 'UponDelivery'];

  deliverables: FormArray;
  deliverableSchedules: string[] = ['Once', 'Weekly', 'Monthly'];
  emailContracts: any = [] as ProjectEmailContract;

  submitted: boolean = false;
  data: any;
  title: any;
  descriptionName: any = [];
  currentDescription: any;
  isLoading: boolean = false;
  emailContractsId: any;
  private content: any;
  dataSubscription: any;
  hoveredIndex: number | null = null;
  constructor(private dialog: NgbModal,
              private router: Router,
              private teamService: TeamService,
              private sessionStorageService: SessionStorageService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private projectService: ProjectService,
              private emailContractService: ProjectEmailContractService,
              private createProjectDeliverableService: CreateProjectDeliverableService,
              private renderer: Renderer2, private el: ElementRef) {
    this.deliverables = fb.array<ProjectDeliverable>([]);
    this.team = teamService.selectedTeam;
    this.teamImage = this.team.avatarUrl;
    this.getProjectEmailContract();
    // this.activatedRoute.snapshot.paramMap.get('encodedInviteCode');

    //This happens when back button is clicked
    /*   const navigation = this.router.getCurrentNavigation();
       this.project = navigation?.extras.state ? navigation.extras.state?.['project'] : this.project;
       let deliverables = navigation?.extras.state ? navigation.extras.state?.['deliverables'] : undefined;*/
    let retrieve = this.sessionStorageService.retrieve('project');
    console.log(retrieve);
    if (retrieve) {
      this.project = retrieve.project
      retrieve.deliverables.forEach((deliverable: any) => {
        this.deliverables.push(this.fb.group(deliverable));
      });
    }
  }

  ngOnInit(): void {
    if (this.deliverables.length === 0) {
      this.addDeliverable();
    }
    this.data = [];
    this.descriptionName = [];
    this.dataSubscription = this.createProjectDeliverableService.data$.subscribe((data) => {
      this.data = data;
    });
    if(this.data != null){
      this.fillInputFields(this.data);
    }
    setTimeout(() => {
      this.scroll('scrollForm');
    },
      10);
  }

  toolTip() {
    const modalRef = this.dialog.open(TooltipComponent);
  }
  imageError() {
    this.teamImage = 'assets/img/app-icon.svg';
  }

  addDeliverable() {
    let projectDeliverable: ProjectDeliverable = {description: '', schedule: 'Once'} as ProjectDeliverable;
    this.deliverables.push(this.fb.group(projectDeliverable));
    let something = this.deliverables as FormArray;
    console.log(this.deliverables.value);
    console.log(something.at(0).get('description'));
  }

  deleteDeliverable(index: number) {
    this.deliverables.removeAt(index);
  }

  next() {
    this.submitted = true;
    if (!this.profileForm.valid || !this.deliverables.valid) {
      return;
    }
    this.sessionStorageService.store('project', {
      project: this.project,
      deliverables: this.deliverables.value,
      members: null,
      emailContractId : this.emailContractsId,
    })
    this.router.navigate(['/deliverable-page'])
  }

  getProjectEmailContract() {
    this.emailContractService.getAll().subscribe((emailContracts) => {
      this.emailContracts = emailContracts;
    })
  }

  createWithEmailContract(emailContract: ProjectEmailContract) {
    this.isLoading = true;
    this.data = [];
    this.profileForm.resetForm();
    this.deliverables.clear();
    this.projectService.createWithEmailContract(this.team?.id!, emailContract.id!).subscribe((data) => {
        this.emailContractsId = emailContract.id;
        this.data = data;
        this.fillInputFields(this.data);
      },
      (error) => {
        this.data = [];
        this.isLoading = false;
      }
    );
  }

  cancel() {
    this.router.navigate(['project-dashboard']);
  }

  fillInputFields(data: any) {
    this.descriptionName = [];
    this.isLoading = false;
    if (data != null) {
      this.project.title = data.title;
      this.descriptionName = data.projectDeliverable;
      if (data.projectDeliverables && data.projectDeliverables.length > 0) {
        this.deliverables.clear(); // Clear existing form controls
        for (let i = 0; i < data.projectDeliverables.length; i++) {
          const projectDeliverable = data.projectDeliverables[i];
          this.addDeliverable(); // Add a new form control
          this.deliverables.at(i).patchValue(projectDeliverable); // Set the form control value
        }
      }
    }
  }

  removeFile(emailContract: any) {
    const dialogRef = this.dialog.open(RemoveFileComponent);
    const userChoiceSubscription = this.createProjectDeliverableService.userChoice$.subscribe(result => {
      userChoiceSubscription.unsubscribe();
      if (result === 'delete') {
        this.emailContractService.delete(emailContract.id).subscribe(() => {
        });
        const messageIdToDelete = emailContract.id;
        const index = this.emailContracts.findIndex((content: any) => content.id === messageIdToDelete);
        if (index !== -1) {
          this.emailContracts.splice(index, 1);
        }
      } else if (result === 'close') {
        console.log('User chose to close');
      }
    });
  }

  scroll(id:string) {
   const targetElement=document.getElementById(id);
   if(targetElement){
     targetElement.scrollIntoView({
       behavior:"smooth"
     })
   }
   else{
     console.log(`element id '${id}' not found`);
   }
  };

  callFunction(){
    this.content.scrollToBottom(0)
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.createProjectDeliverableService.clearData();
  }
}
