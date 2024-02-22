import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StepTwoComponent} from "./pages/create-workspace/step-two/step-two.component";
import {StepOneComponent} from "./pages/create-workspace/step-one/step-one.component";
import {CreateWorkspaceComponent} from "./pages/create-workspace/create-workspace.component";
import {SetUpProfileComponent} from "./pages/set-up-profile/set-up-profile.component";
import {CheckEmailComponent} from "./pages/check-email/check-email.component";
import {SignupComponent} from "./pages/signup/signup.component";
import {LoginComponent} from "./pages/login/login.component";
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";
import {DealListComponent} from "./pages/deal/deal-list/deal-list.component";
import {DeliverableListComponent} from "./pages/deliverable/deliverable-list/deliverable-list.component";

import {WorkspaceComponent} from './pages/workspace/workspace.component';
import {EditWorkspaceComponent} from './pages/workspace/edit-workspace/edit-workspace.component';
import {DeleteWorkspaceComponent} from './pages/workspace/delete-workspace/delete-workspace.component';
import {RolesComponent} from './pages/workspace/roles/roles.component';
import {AddRoleComponent} from './pages/workspace/roles/add-role/add-role.component';
import {EditRoleComponent} from './pages/workspace/roles/edit-role/edit-role.component';
import {ProfileSettingsComponent} from './pages/profile-settings/profile-settings.component';
import {PasswordComponent} from './pages/profile-settings/password/password.component';
import {NotificationComponent} from './pages/profile-settings/notification/notification.component';

import {DealComponent} from './pages/deal/deal.component';
import {CreateDealComponent} from './pages/deal/create-deal/create-deal.component';
import {EditDealComponent} from './pages/deal/edit-deal/edit-deal.component';

import {DeliverableComponent} from './pages/deliverable/deliverable.component';
import {CreateDeliverableComponent} from './pages/deliverable/create-deliverable/create-deliverable.component';
import {EditDeliverableComponent} from './pages/deliverable/edit-deliverable/edit-deliverable.component';
import {authGuard} from "./auth/auth.guard";

import {WelcomeComponent} from './pages/channel/welcome/welcome.component';
import {ChannelComponent} from './pages/channel/channel.component';
import {LeaveWorkspaceComponent} from "./pages/workspace/leave-workspace/leave-workspace.component";


import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {EnterOtpComponent} from './pages/enter-otp/enter-otp.component';
import {ManageMembersComponent} from './pages/workspace/manage-members/manage-members.component';
import {RoasterComponent} from './pages/roaster/roaster.component';
import {RoasterViewLinkComponent} from './pages/roaster/roaster-view-link/roaster-view-link.component';
import {PendingChangesGuard} from "./auth/pending-changes-guard.guard";
import {AboutUsComponent} from "./pages/about-us/about-us.component";
import {HomeComponent} from "./pages/home/home.component";
import {SignInComponent} from "./pages/sign-in/sign-in.component";
import {Signin2Component} from "./pages/signin2/signin2.component";
import {CreateAccountComponent} from "./pages/create-account/create-account.component";
import {ProjectDashboardComponent} from "./pages/project-dashboard/project-dashboard.component";
import {CreateProjectComponent} from "./pages/create-project/create-project.component";
import {DeliverablePageComponent} from "./pages/deliverable-page/deliverable-page.component";
import {HeaderComponent} from "./pages/header/header.component";
import {FooterComponent} from "./pages/footer/footer.component";
import {InviteMemberComponent} from "./pages/project/invite/invite-member.component";
import {ChatDashboardComponent} from "./pages/chat-dashboard/chat-dashboard.component";
import {SplashComponent} from "./pages/splash/splash.component";
import {TooltipSplashComponent} from "./pages/tooltip-splash/tooltip-splash.component";
import {LoadingPageComponent} from "./pages/loading-page/loading-page.component";
import {PasswordResetComponent} from "./pages/password-reset/password-reset.component";
import {OtpVerificationComponent} from "./pages/otp-verification/otp-verification.component";
import {PasswordResetSuccessComponent} from "./pages/password-reset-success/password-reset-success.component";
import {RequestPermissionComponent} from "./pages/request-permission/request-permission.component";
import {TeamTemplateComponent} from "./pages/team-template/team-template.component";
let routes: Routes;
routes = [
  {
    path:'signin',
    component:SignInComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'signin2',
    component:Signin2Component
  },
  {
    path:'create-account',
    component:CreateAccountComponent
  },
  {
    path:'reset-password',
    component:ResetPasswordComponent
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent
  },
  {
    path:'otp-verification',
    component: OtpVerificationComponent
  },
  {
    path:'password-reset-success',
    component: PasswordResetSuccessComponent
  },
  {
    path:'project-dashboard',
    component:ProjectDashboardComponent
  },
  {
    path:'create-project',
    component:CreateProjectComponent
  },
  {
    path:'deliverable-page',
    component:DeliverablePageComponent
  },
  {
    path:'invite',
    component:InviteMemberComponent
  },
  {
    path:'chat-dashboard',
    component:ChatDashboardComponent
  },
  {
    path:'tooltip-splash',
    component: TooltipSplashComponent
  },
  {
    path:'loading-bar',
    component: LoadingPageComponent
  },
  {
    path:'team-template',
    component:TeamTemplateComponent
  },

  { path: '**', redirectTo: 'splash', pathMatch: 'full' },
  {
    path:'splash',
    component:SplashComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path:'aboutUs',
    component:AboutUsComponent
  },

  {
    path: 'checkEmail',
    component: CheckEmailComponent
  },
  {
    path: 'SetUpProfile',
    component: SetUpProfileComponent
  },
  {
    path: 'createWorkspace',
    component: CreateWorkspaceComponent
  },
  {
    path: 'CreateWorkspaceStepOne',
    component: StepOneComponent
  },
  {
    path: 'CreateWorkspaceStepTwo',
    component: StepTwoComponent
  },
  {
    path: 'main',
    component: MainLayoutComponent,
    children: [{
      path: 'deal1',
      component: DealListComponent
    }, {
      path: 'deliverable1',
      component: DeliverableListComponent
    }]
  },
  {
    path: '',
    component: WorkspaceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ws/:encodedInviteCode',
    component: WorkspaceComponent,
  },
  {
    path: 'editWorkspace',
    component: EditWorkspaceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'deleteWorkspace',
    component: DeleteWorkspaceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'leaveWorkspace',
    component: LeaveWorkspaceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'addRole',
    component: AddRoleComponent,
    canActivate: [authGuard]
  },
  {
    path: 'editRole',
    component: EditRoleComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profileSettings',
    component: ProfileSettingsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'password',
    component: PasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'notification',
    component: NotificationComponent,
    canActivate: [authGuard]
  },
  {
    path: 'deals',
    component: DealComponent,
    canActivate: [authGuard]
  },
  {
    path: 'deals/:encodedInviteCode',
    component: EditDealComponent,
  },
  {
    path: 'createDeal',
    component: CreateDealComponent,
    canActivate: [authGuard],
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'editDeal',
    component: EditDealComponent,
    canActivate: [authGuard]
  },
  {
    path: 'deliverable',
    component: DeliverableComponent,
    canActivate: [authGuard]
  },
  {
    path: 'deliverables/:encodedInviteCode',
    component: EditDeliverableComponent,
  },
  {
    path: 'createDeliverable',
    component: CreateDeliverableComponent,
    canActivate: [authGuard]
  },
  {
    path: 'editDeliverable',
    component: EditDeliverableComponent,
    canActivate: [authGuard]
  },
  {
    path: 'welcomeChannel',
    component: WelcomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'channel',
    component: ChannelComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'enterOtp',
    component: EnterOtpComponent,
  },
  {
    path: 'manageMembers',
    component: ManageMembersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'rosters',
    component: RoasterComponent
  },
  {
    path: 'rosters/:encodedInviteCode',
    component: RoasterViewLinkComponent
  },
  {
    path:'request-permission',
    component:RequestPermissionComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
