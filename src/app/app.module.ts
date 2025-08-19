import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloLink, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MatCardModule } from '@angular/material/card';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { CommunityFundComponent } from './pages/community-fund/community-fund.component';
import { MatSelectModule } from '@angular/material/select';
import { MemberComponent } from './pages/member/member.component';
import { CreateMemberComponent } from './pages/create-member/create-member.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { LoanDialogComponent } from './pages/loan-dialog/loan-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ContributionDialogComponent } from './pages/contribution-dialog/contribution-dialog.component';
import { PayLoanDialogComponent } from './pages/pay-loan-dialog/pay-loan-dialog.component';
import { CommunityFundDialogComponent } from './pages/community-fund-dialog/community-fund-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MemberProfileComponent } from './pages/member-profile/member-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ContributionsComponent } from './pages/contributions/contributions.component';
import { LoanComponent } from './pages/loan/loan.component';
import { MatMenuModule } from '@angular/material/menu';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoanPaymentsComponent } from './pages/loan-payments/loan-payments.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpendituresComponent } from './pages/expenditures/expenditures.component';
import { ExpenseDialogComponent } from './pages/expense-dialog/expense-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DividendDialogComponent } from './pages/dividend-dialog/dividend-dialog.component';
import { YearlyDividendsComponent } from './pages/yearly-dividends/yearly-dividends.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { CommonFundsComponent } from './pages/common-funds/common-funds.component';
import { UsersComponent } from './pages/users/users.component';
import { CommonFundDialogComponent } from './pages/common-fund-dialog/common-fund-dialog.component';
import { PastMembersComponent } from './pages/past-members/past-members.component';
import { RemoveMemberDialogComponent } from './pages/remove-member-dialog/remove-member-dialog.component';
import { InsertEntryFeeComponent } from './pages/insert-entry-fee/insert-entry-fee.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

const httpLink = createHttpLink({
  uri: 'http://localhost:7080/graphql',
});

// Authenticate every request with token from localStorage
const authLink = setContext((operation, context) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...context['headers'],
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ChangePasswordComponent,
    CreateUserComponent,
    AdminPageComponent,
    CommunityFundComponent,
    MemberComponent,
    CreateMemberComponent,
    LoanDialogComponent,
    ContributionDialogComponent,
    PayLoanDialogComponent,
    CommunityFundDialogComponent,
    MemberProfileComponent,
    ContributionsComponent,
    LoanComponent,
    LandingPageComponent,
    LoanPaymentsComponent,
    ExpendituresComponent,
    ExpenseDialogComponent,
    DividendDialogComponent,
    YearlyDividendsComponent,
    CommonFundsComponent,
    UsersComponent,
    CommonFundDialogComponent,
    PastMembersComponent,
    RemoveMemberDialogComponent,
    InsertEntryFeeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTabsModule,
    MatMenuModule,
    NgxChartsModule,
    MatTooltipModule,
    DragDropModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule
  ],
  providers: [
    provideApollo(() => {
      return {
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink as unknown as ApolloLink),
      };
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
