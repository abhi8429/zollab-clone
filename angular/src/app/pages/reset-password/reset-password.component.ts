import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {IdentityService} from "../../services/identity.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  submitted: boolean = false;
  @ViewChild('emailInput') emailInput: ElementRef | undefined;
  emailId: string | undefined
  constructor(public fb: FormBuilder,
              public router: Router,
              public identityService: IdentityService,
              private location: Location
  ) {
  }

  resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, this.emailSuffixValidator]]
  });

  emailSuffixValidator(control: FormControl) {
    const email = control.value as string;
    if (email && !/.{2,}\..{2,}/.test(email)) {
      return {invalidSuffix: true};
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    else if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      if (email != null) {
        this.callApiToSendOTP(email);
      }
    }
  }

  get email() {
    return this.resetForm.get('email');
  }

  protected get registerFormControl() {
    return this.resetForm.controls;
  }

  backButton() {
    this.location.back();
  }

  callApiToSendOTP(email: string) {
    this.emailId = email;
    this.identityService.sendOtp({ email: email }).subscribe((response) => {
        this.router.navigate(['/otp-verification']);
    this.sendData();
    },
      (error) =>{
        if (this.emailInput) {
          this.emailInput.nativeElement.value = '';
        }
      });
  }

  sendData() {
    if (typeof this.emailId === "string") {
      localStorage.setItem('email', this.emailId);
    }
  }
}
