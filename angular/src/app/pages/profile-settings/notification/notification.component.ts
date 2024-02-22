import { Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../../auth/auth.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Notification} from "../../../model/notification";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  private userId: number;

  notification! : Notification | undefined;

  constructor(private userService: UserService,
              public fb: FormBuilder,
              authService: AuthService,
              public jwtHelper: JwtHelperService) {
    const accessToken = authService.getAccessToken();
    this.userId = jwtHelper.decodeToken(accessToken).id;
    this.getNotifications();
  }

  notificationForm = this.fb.group({
    channelNotification: this.fb.group({
      channelDirectMessages: [''],
    }),
    dealNotification: this.fb.group({
      newOneAdded: [false],
      changeInStatus: [false],
      descriptionUpdated: [false],
      pricingUpdated: [false],
      startDateUpdated: [false],
      expiryDateUpdated: [false],
      priorityUpdated: [false],
    }),
    deliverableNotification: this.fb.group({
      newOneAdded: [false],
      changeInStatus: [false],
      reviewerAdded: [false],
      descriptionUpdated: [false],
      priorityUpdated: [false],
      evidenceAdded: [false],
      evidenceUpdated: [false],
      overdueReminder: [false],
    }),
    applicationNotificationSchedule: this.fb.group({
      language: [''],
      startTime: [''],
      endTime: ['']
    })
  })
  getNotifications() {
    this.userService.getNotification(this.userId).subscribe((response) => {
      if(!!response) {
        this.notification = response;
        this.patchForm();
      }
    })
  }

  private patchForm() {
    this.notificationForm.patchValue({
      channelNotification: {
        channelDirectMessages: this.notification?.channelNotification?.channelDirectMessages
      },
      dealNotification: {
        changeInStatus: this.notification?.dealNotification?.changeInStatus,
        descriptionUpdated: this.notification?.dealNotification?.descriptionUpdated,
        expiryDateUpdated: this.notification?.dealNotification?.expiryDateUpdated,
        newOneAdded: this.notification?.dealNotification?.newOneAdded,
        pricingUpdated: this.notification?.dealNotification?.pricingUpdated,
        priorityUpdated: this.notification?.dealNotification?.priorityUpdated,
        startDateUpdated: this.notification?.dealNotification?.startDateUpdated
      },
      deliverableNotification: {
        priorityUpdated: this.notification?.deliverableNotification?.priorityUpdated,
        newOneAdded: this.notification?.deliverableNotification?.newOneAdded,
        descriptionUpdated: this.notification?.deliverableNotification?.descriptionUpdated,
        changeInStatus: this.notification?.deliverableNotification?.changeInStatus,
        evidenceAdded: this.notification?.deliverableNotification?.evidenceAdded,
        evidenceUpdated: this.notification?.deliverableNotification?.evidenceUpdated,
        overdueReminder: this.notification?.deliverableNotification?.overdueReminder,
        reviewerAdded: this.notification?.deliverableNotification?.reviewerAdded
      },
      applicationNotificationSchedule: {
        endTime: this.notification?.applicationNotificationSchedule?.endTime,
        startTime: this.notification?.applicationNotificationSchedule?.startTime,
        language: this.notification?.applicationNotificationSchedule?.language,
      }
    })
  }

  onSubmit() {
    this.userService.updateNotification(this.userId, this.notificationForm.value!).subscribe((response) => {
      console.log('-------------', response);
    })
  }
}
