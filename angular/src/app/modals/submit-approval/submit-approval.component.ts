// submit-approval.component.ts
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-submit-approval',
  templateUrl: './submit-approval.component.html',
  styleUrls: ['./submit-approval.component.css']
})
export class SubmitApprovalComponent {

  @ViewChild('approvalForm', { static: true }) approvalForm!: NgForm; // Add this line

  formData = {
    name: '',
    email: ''
  };

  onSubmit(form: any) {
    if (form.valid) {
      // Handle form submission logic here
      console.log('Form submitted:', this.formData);
    }
    else {
      this.markControlsAsTouched();
    }
  }

  markControlsAsTouched() {
    // Set all form controls as touched
    Object.keys(this.approvalForm.controls).forEach(controlName => {
      this.approvalForm.controls[controlName].markAsTouched();
    });
  }

  goBack() {
    // Handle "Go Back" logic here
    console.log('Go Back clicked');
  }

  get isNameRequiredError(): boolean {
    const nameControl = this.approvalForm.controls['name'];
    return nameControl?.hasError('required') && (nameControl?.dirty || nameControl?.touched);
  }

  get isEmailRequiredError(): boolean {
    const emailControl = this.approvalForm.controls['email'];
    return emailControl?.hasError('required') && (emailControl?.dirty || emailControl?.touched);
  }

  get isEmailPatternError(): boolean {
    const emailControl = this.approvalForm.controls['email'];
    return emailControl?.hasError('pattern') && (emailControl?.dirty || emailControl?.touched);
  }
}
