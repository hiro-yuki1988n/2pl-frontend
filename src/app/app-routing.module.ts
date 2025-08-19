import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { CommunityFundComponent } from './pages/community-fund/community-fund.component';
import { MemberComponent } from './pages/member/member.component';
import { CreateMemberComponent } from './pages/create-member/create-member.component';
import { MemberProfileComponent } from './pages/member-profile/member-profile.component';
import { ContributionsComponent } from './pages/contributions/contributions.component';
import { LoanComponent } from './pages/loan/loan.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoanPaymentsComponent } from './pages/loan-payments/loan-payments.component';
import { ExpendituresComponent } from './pages/expenditures/expenditures.component';
import { YearlyDividendsComponent } from './pages/yearly-dividends/yearly-dividends.component';
import { CommonFundsComponent } from './pages/common-funds/common-funds.component';
import { UsersComponent } from './pages/users/users.component';
import { PastMembersComponent } from './pages/past-members/past-members.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin-page', component: AdminPageComponent, // layout with sidenav
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'common-funds', component: CommonFundsComponent },
      { path: 'past-members', component: PastMembersComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ] },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'create-user/:id', component: CreateUserComponent },
  { path: 'community-fund', component: CommunityFundComponent },
  { path: 'member', component: MemberComponent },
  { path: 'create-member', component: CreateMemberComponent },
  { path: 'member-profile/:id', component: MemberProfileComponent },
  { path: 'members/:id/profile', component: MemberProfileComponent },
  { path: 'contributions', component: ContributionsComponent},
  { path: 'loan', component: LoanComponent},
  { path: 'loan-payments', component: LoanPaymentsComponent},
  { path: 'expenditures', component: ExpendituresComponent},
  { path: 'yearly-dividends', component: YearlyDividendsComponent},
  { path: '', component: LandingPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
