import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {HomeComponent} from './pages/home/home.component';
import {CheckEmailComponent} from './pages/check-email/check-email.component';
import {CreateWorkspaceComponent} from './pages/create-workspace/create-workspace.component';
import {LoginComponent} from './pages/login/login.component';
import {SignupComponent} from './pages/signup/signup.component';
import {SetUpProfileComponent} from './pages/set-up-profile/set-up-profile.component';
import {StepOneComponent} from './pages/create-workspace/step-one/step-one.component';
import {StepTwoComponent} from './pages/create-workspace/step-two/step-two.component';
import {DealListComponent} from './pages/deal/deal-list/deal-list.component';
// import {DeliverableListComponent} from './pages/deliverable/deliverable-list/deliverable-list.component';
import {WorkspaceComponent} from './pages/workspace/workspace.component';
import {EditWorkspaceComponent} from './pages/workspace/edit-workspace/edit-workspace.component';
import {DeleteWorkspaceComponent} from './pages/workspace/delete-workspace/delete-workspace.component';
import {RolesComponent} from './pages/workspace/roles/roles.component';
import {AddRoleComponent} from './pages/workspace/roles/add-role/add-role.component';
import {EditRoleComponent} from './pages/workspace/roles/edit-role/edit-role.component';
import {ProfileSettingsComponent} from './pages/profile-settings/profile-settings.component';
import {PasswordComponent} from './pages/profile-settings/password/password.component';
import {NotificationComponent} from './pages/profile-settings/notification/notification.component';
import {LeaveWorkspaceComponent} from './pages/workspace/leave-workspace/leave-workspace.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";
import {NgxWebstorageModule} from "ngx-webstorage";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {AuthService} from "./auth/auth.service";
import {DealComponent} from './pages/deal/deal.component';
import {CreateDealComponent} from './pages/deal/create-deal/create-deal.component';
import {EditDealComponent} from './pages/deal/edit-deal/edit-deal.component';
import {DeliverableComponent} from './pages/deliverable/deliverable.component';
import {CreateDeliverableComponent} from './pages/deliverable/create-deliverable/create-deliverable.component';
import {EditDeliverableComponent} from './pages/deliverable/edit-deliverable/edit-deliverable.component';
import {InviteWorkspaceMembersComponent} from "./modals/invite-workspace-members/invite-workspace-members.component";
import {NgProgressModule} from "ngx-progressbar";
import {NgProgressHttpModule} from "ngx-progressbar/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {WelcomeComponent} from './pages/channel/welcome/welcome.component';
import {ChannelComponent} from './pages/channel/channel.component';
// import {ClipboardModule} from "@angular/cdk/clipboard";
import {ProfileMenuComponent} from "./pages/profile-settings/profile-menu/profile-menu/profile-menu.component";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {LeftMenuComponent} from './layouts/side-menu/left-menu/left-menu.component';
import {RightMenuComponent} from './layouts/side-menu/right-menu/right-menu.component';

import {SelectedWorkspaceComponent} from "./layouts/side-menu/selected-workspace/selected-workspace.component";
import {DeleteDealComponent} from './modals/delete-deal/delete-deal.component';
import {ChangesNeededComponent} from './modals/changes-needed/changes-needed.component';

import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {EnterOtpComponent} from './pages/enter-otp/enter-otp.component';
import {ManageMembersComponent} from './pages/workspace/manage-members/manage-members.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrInterceptor} from "./interceptor/toastr.interceptor";
import {DeleteDeliverableComponent} from "./modals/delete-deliverable/delete-deliverable.component";
import {DeleteMemberComponent} from './modals/delete-member/delete-member.component';
import {ErrorHandlerService} from "./services/error.handler.service";
import {ReportComponent} from "./modals/report/report.component";
import {NumberSuffixPipe} from './pipe/number-suffix.pipe';
import {FilePreviewComponent} from './modals/file-preview/file-preview.component';
import {RoasterComponent} from './pages/roaster/roaster.component';
import {RoasterViewLinkComponent} from './pages/roaster/roaster-view-link/roaster-view-link.component';
import {ShareRosterComponent} from './modals/share-roster/share-roster.component';
import {TextShortenPipe} from "./pipe/text-shorten.pipe";
import {AddChannelComponent} from "./modals/add-channel/add-channel.component";
import {TimeAgoPipe} from "./pipe/time-ago.pipe";
import {GroupByDatePipe} from './pipe/group-by-date.pipe';
import {
  InviteChannelMembersComponent
} from './modals/invite-channel-members/invite-channel-members/invite-channel-members.component';
import {SanitizePipe} from './pipe/sanitize.pipe';
import {PendingChangesGuard} from "./auth/pending-changes-guard.guard";
import {AboutUsComponent} from './pages/about-us/about-us.component';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {CreateTeamComponent} from './modals/create-team/create-team.component';
import {Signin2Component} from './pages/signin2/signin2.component';
import {CreateAccountComponent} from './pages/create-account/create-account.component';
import {ProjectDashboardComponent} from './pages/project-dashboard/project-dashboard.component';
import {ProfileComponent} from './modals/profile/profile.component';
// import { CreateProjectComponent } from './modals/create-project/create-project.component';
import {RemoveMemberComponent} from './modals/remove-member/remove-member.component';
import {TooltipComponent} from './modals/tooltip/tooltip.component';
import {MatchPasswordDirective} from "./directives/match-password.directive";
import { DeliverablePageComponent } from './pages/deliverable-page/deliverable-page.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import {CreateProjectComponent} from "./pages/create-project/create-project.component";
import { InviteMemberComponent } from './pages/project/invite/invite-member.component';
import { ChatDashboardComponent } from './pages/chat-dashboard/chat-dashboard.component';
import { ReviewApprovalComponent } from './modals/review-approval/review-approval.component';
import { DraftUploadComponent } from './modals/draft-upload/draft-upload.component';
import { SettingComponent } from './modals/setting/setting.component';
import { PaymentComponent } from './modals/payment/payment.component';
import { StatsComponent } from './modals/stats/stats.component';
import { PaymentDoneComponent } from './modals/payment-done/payment-done.component';
import { PaypalPaymentComponent } from './modals/paypal-payment/paypal-payment.component';
import { BankAccountPaymentComponent } from './modals/bank-account-payment/bank-account-payment.component';
import { TransferOwnershipComponent } from './modals/transfer-ownership/transfer-ownership.component';
import { ProjectDetailsComponent } from './modals/project-details/project-details.component';
import { InstagramReelComponent } from './modals/instagram-reel/instagram-reel.component';
import { AssetsComponent } from './modals/assets/assets.component';
import {NgxTypedJsModule} from 'ngx-typed-js';
import { ImageModalComponent } from './modals/image-modal/image-modal.component';
import { FrequencyComponent } from './modals/frequency/frequency.component';
import { StarredMessagesComponent } from './modals/starred-messages/starred-messages.component';
import { ImageChatModalComponent } from './modals/image-chat-modal/image-chat-modal.component';
import { ShareFileComponent } from './modals/share-file/share-file.component';
import { ZipFileComponent } from './modals/zip-file/zip-file.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {DeliverableListComponent} from "./modals/deliverable-list/deliverable-list.component";
import { UploadDeliverableComponent } from './modals/upload-deliverable/upload-deliverable.component';
import { SplashComponent } from './pages/splash/splash.component';
import { TooltipSplashComponent } from './pages/tooltip-splash/tooltip-splash.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ClipboardModule } from 'ngx-clipboard';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatNativeDateModule} from '@angular/material/core';
import { RemoveFileComponent } from './modals/remove-file/remove-file.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { ImagePreviewDialogComponent } from './modals/image-preview-dialog/image-preview-dialog.component';
// import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component'
import { OtpVerificationComponent } from './pages/otp-verification/otp-verification.component';
import { PasswordResetSuccessComponent } from './pages/password-reset-success/password-reset-success.component';
import { RequestPermissionComponent } from './pages/request-permission/request-permission.component';
import { SubmitApprovalComponent } from './modals/submit-approval/submit-approval.component';
import { GuestApprovedComponent } from './modals/guest-approved/guest-approved.component';
import { TeamTemplateComponent } from './pages/team-template/team-template.component'
@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomeComponent,
    CheckEmailComponent,
    CreateWorkspaceComponent,
    LoginComponent,
    SignupComponent,
    SetUpProfileComponent,
    StepOneComponent,
    StepTwoComponent,
    DealListComponent,
    DeliverableListComponent,
    WorkspaceComponent,
    EditWorkspaceComponent,
    DeleteWorkspaceComponent,
    RolesComponent,
    AddRoleComponent,
    EditRoleComponent,
    ProfileSettingsComponent,
    PasswordComponent,
    NotificationComponent,
    LeaveWorkspaceComponent,
    DealComponent,
    CreateDealComponent,
    EditDealComponent,
    DeliverableComponent,
    CreateDeliverableComponent,
    EditDeliverableComponent,
    InviteWorkspaceMembersComponent,
    WelcomeComponent,
    ChannelComponent,
    ProfileMenuComponent,
    LeftMenuComponent,
    RightMenuComponent,
    SelectedWorkspaceComponent,
    DeleteDealComponent,
    ChangesNeededComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EnterOtpComponent,
    ManageMembersComponent,
    DeleteDeliverableComponent,
    DeleteMemberComponent,
    ReportComponent,
    NumberSuffixPipe,
    FilePreviewComponent,
    RoasterComponent,
    RoasterViewLinkComponent,
    ShareRosterComponent,
    TextShortenPipe,
    AddChannelComponent,
    TimeAgoPipe,
    GroupByDatePipe,
    InviteChannelMembersComponent,
    SanitizePipe,
    AboutUsComponent,
    SignInComponent,
    CreateTeamComponent,
    Signin2Component,
    CreateAccountComponent,
    ProjectDashboardComponent,
    ProfileComponent,
    CreateProjectComponent,
    RemoveMemberComponent,
    TooltipComponent,
    MatchPasswordDirective,
    DeliverablePageComponent,
    HeaderComponent,
    FooterComponent,
    InviteMemberComponent,
    ChatDashboardComponent,
    ReviewApprovalComponent,
    DraftUploadComponent,
    SettingComponent,
    PaymentComponent,
    StatsComponent,
    PaymentDoneComponent,
    PaypalPaymentComponent,
    BankAccountPaymentComponent,
    TransferOwnershipComponent,
    ProjectDetailsComponent,
    InstagramReelComponent,
    AssetsComponent,
    ImageModalComponent,
    FrequencyComponent,
    StarredMessagesComponent,
    ImageChatModalComponent,
    ShareFileComponent,
    ZipFileComponent,
    DeliverableListComponent,
    UploadDeliverableComponent,
    SplashComponent,
    TooltipSplashComponent,
    RemoveFileComponent,
    LoadingPageComponent,
    ImagePreviewDialogComponent,
    PasswordResetComponent,
    OtpVerificationComponent,
    PasswordResetSuccessComponent,
    RequestPermissionComponent,
    SubmitApprovalComponent,
    GuestApprovedComponent,
    TeamTemplateComponent
  ],
  imports: [
    NgxTypedJsModule,
    BrowserModule,
    AppRoutingModule,
    PickerModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxWebstorageModule.forRoot({prefix: 'stella'}),
    NgProgressModule.withConfig({
      spinner: false,
      color: 'blue',
      thick: true
    }),
    NgProgressHttpModule,
    ClipboardModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    InfiniteScrollModule,
    ImageCropperModule,
    EmojiModule,
    MatDatepickerModule,
    MatLegacyFormFieldModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: JwtHelperService,
      useFactory: () => new JwtHelperService()
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      deps: [
        AuthService
      ]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ToastrInterceptor,
      multi: true,
      deps: [
        ToastrService,
        ErrorHandlerService
      ]
    },
    [PendingChangesGuard],
    [DatePipe]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
