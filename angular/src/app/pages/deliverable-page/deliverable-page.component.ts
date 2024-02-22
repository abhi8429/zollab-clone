import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Project } from "../../model/project";
import { NgForm } from "@angular/forms";
import { ProjectService } from "../../services/project.service";
import { TeamService } from "../../services/team.service";
import { Deliverable } from "../../model/deliverable";
import { ProjectDeliverableService } from "../../services/proiect.deliverable.service";
import { SessionStorageService } from "ngx-webstorage";
import * as moment from 'moment';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-deliverable-page',
  templateUrl: './deliverable-page.component.html',
  styleUrls: ['./deliverable-page.component.css']
})
export class DeliverablePageComponent {
  @ViewChild('projectForm') projectForm!: NgForm;
  project: Project = {} as Project;
  firstUseExpirations: string[] = ['InPerpetuity'];
  submitted: boolean = false;
  deliverables: any = [] as Deliverable;
  errorMessages: { projectStatedAt: string, firstUseAt: string, expirationFromFirstUseAt: string } = {
    projectStatedAt: '',
    firstUseAt: '',
    expirationFromFirstUseAt: ''
  };
  minDate:any;
  constructor(private router: Router,private datePipe: DatePipe,
              private sessionStorageService: SessionStorageService,private calendar: NgbCalendar) {
    const navigation = this.router.getCurrentNavigation();
    let projectStore = this.sessionStorageService.retrieve('project');
    this.project = projectStore.project;
    const currentDate = this.calendar.getToday();

    // Set the minimum date to the current date
      this.minDate = currentDate;
      
  }

  next() {
    this.submitted = true;
    if (!this.projectForm.valid || !this.validateDates()) {
      return;
    }
    if (!this.validateForm() || !this.validateDates()) {
      return;
    }
    this.router.navigate(['invite']);
  }

  isValid() {
    // Check if both date fields are valid
    return !this.project.projectStartedAt && !this.project.expirationFromFirstUseAt;
  }
  validateForm(): boolean {
    // Check if projectStartedAt, firstUseAt, and expirationFromFirstUseAt are empty
    if (!this.project.projectStartedAt && !this.project.firstUseAt && !this.project.expirationFromFirstUseAt) {
      this.errorMessages.projectStatedAt = "This is a required field.";
      this.errorMessages.firstUseAt = "This is a required field.";
      this.errorMessages.expirationFromFirstUseAt = "This is a required field.";
      return false;
    } else {
      // Clear error messages if fields are not empty
      this.errorMessages.projectStatedAt = '';
      this.errorMessages.firstUseAt = '';
      this.errorMessages.expirationFromFirstUseAt = '';
    }
  
    // Check if projectStartedAt is empty
    if (!this.project.projectStartedAt) {
      this.errorMessages.projectStatedAt = "This is a required field.";
      return false;
    } else {
      // Clear error message if projectStartedAt is not empty
      this.errorMessages.projectStatedAt = '';
    }
  
    // Check if firstUseAt is empty
    if (!this.project.firstUseAt) {
      this.errorMessages.firstUseAt = "This is a required field.";
      return false;
    }
  
    // Check if expirationFromFirstUseAt is empty
    if (!this.project.expirationFromFirstUseAt) {
      this.errorMessages.expirationFromFirstUseAt = "This is a required field.";
      return false;
    }
  
    // All fields are filled, return true
    return true;
  }
  

  validateDates1(): boolean {
    const currentDate = new Date().getTime();
    // @ts-ignore
    const projectStartDate = new Date(this.project.projectStartedAt).getTime();
    // @ts-ignore
    const firstUseDate = new Date(this.project.firstUseAt).getTime();
    // @ts-ignore
    const expirationFromDate = new Date(this.project.expirationFromFirstUseAt).getTime();

    if (projectStartDate <= currentDate) {
      this.errorMessages.projectStatedAt = "Project start date must be a future date.";
      return false;
    } else {
      this.errorMessages.projectStatedAt = '';
    }

    if (firstUseDate <= projectStartDate) {
      this.errorMessages.firstUseAt = "First use date must be after project start date.";
      return false;
    } else {
      this.errorMessages.firstUseAt = '';
    }

    if (expirationFromDate <= firstUseDate) {
      this.errorMessages.expirationFromFirstUseAt = "Expiration date must be after first use date.";
      return false;
    } else {
      this.errorMessages.expirationFromFirstUseAt = '';
    }

    return true;
  }

  isEndDateValid:boolean=true;
  validateDates(): boolean {
    let projectStartedAt = this.combineDateTime(this.project.projectStartedAt);
    let firstUseAt:any = this.combineDateTime(this.project.firstUseAt);
    let expirationFromFirstUseAt = this.combineDateTime(this.project.expirationFromFirstUseAt);

    const pstartDate = this.extractDate(projectStartedAt);
    const frstuseDate:any = this.extractDate(firstUseAt);
    const expirationDate:any = this.extractDate(expirationFromFirstUseAt);

    if (!this.project.projectStartedAt) {
      this.errorMessages.projectStatedAt = "This is a required field.";
    } else {
      // Clear error message if projectStartedAt is not empty
      this.errorMessages.projectStatedAt = '';
    }

    if (this.project.firstUseAt && frstuseDate.before(pstartDate)) {
      this.errorMessages.firstUseAt = "First use date must be after project start date.";
      return false;
    } else {
      this.errorMessages.firstUseAt = '';
    }
    
    if (this.project.expirationFromFirstUseAt && expirationDate.before(frstuseDate)) {
      this.errorMessages.expirationFromFirstUseAt = "Expiration date must be after first use date.";
      return false;
    } else {
      this.errorMessages.expirationFromFirstUseAt = '';
    }
   
   
    return true;
  }

  extractDate(selectedDate:any): NgbDate {
    // Parse the date string into a Date object
    const date = new Date(selectedDate);
    // Extract year, month, and day from the Date object
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    selectedDate = new NgbDate(year, month, day);
    return selectedDate;
  }
  combineDateTime(date: any | undefined): string {
    if (!date) {
        return ''; // or throw an error, depending on your requirements
    }
    const formattedDate = `${date.year}-${date.month}-${date.day}`;
    return `${formattedDate}`;
  }

  back() {
    this.router.navigate(['create-project']);
  }
  
}
