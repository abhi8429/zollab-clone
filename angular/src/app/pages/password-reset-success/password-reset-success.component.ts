import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {IdentityService} from "../../services/identity.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-password-reset-success',
  templateUrl: './password-reset-success.component.html',
  styleUrls: ['./password-reset-success.component.css']
})
export class PasswordResetSuccessComponent {
  constructor(private location: Location) {}
  backButton(){
    this.location.back()
  }
}
