import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {IdentityService} from "../../services/identity.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent {
  submitted:boolean=false;
  isVisible:boolean=false;
  emailId: string | undefined;
  otpValue: any | undefined;
  otpForm!: FormGroup;
  @ViewChild('otpInput') otpInput: ElementRef | undefined;

  // inputValue: string = '';
  constructor(public fb:FormBuilder,
              public router:Router,
              private route: ActivatedRoute,
              public identityService: IdentityService,
              public location:Location
  ) {
  }

  ngOnInit() {
  this.getData();
    this.showDivForDuration(5000);
    this.createForm();
  }
  showDivForDuration(duration:number){
    this.isVisible=true;
    setTimeout(()=>{
      this.isVisible=false;
    },5000)

  }

  onSubmit(){
    this.submitted=true;
    if (!this.otpForm.valid) {
      console.log('Invalid Form')
      return;
    }
    else{

    }

  }
  get email() {
    return this.otpForm.get('email');
  }
  protected get registerFormControl() {
    return this.otpForm.controls;
  }
  backButton(){
  this.location.back()
  }

  callApiToSendOTP() {
    this.identityService.sendOtp({ email: this.emailId }).subscribe(() => {
      this.showDivForDuration(8000);
    });
  }

  resetPassword() {
    // @ts-ignore
    this.otpValue = this.otpForm.get('otp').value;
    this.identityService.verify({ email: this.emailId, otp: this.otpValue }).subscribe(() => {
        this.router.navigate(['/password-reset']);
        this.sendData();
      },
      (error) => {
        if (this.otpInput) {
          this.otpInput.nativeElement.value = '';
        }
      });
  }

  createForm() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required,Validators.pattern(/^[0-9]{4}$/)]]
    });
  }

  getData() {
    const sharedData = localStorage.getItem('email');
    // @ts-ignore
    this.emailId =  sharedData;
  }

  sendData() {
    if (typeof this.emailId === "string") {
      localStorage.setItem('email', this.emailId);
      localStorage.setItem('otp', this.otpValue);
    }
  }
}
