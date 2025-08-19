import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { MemberService } from '../../services/member.service';

export const GET_GROUP_SAVINGS = gql`
  query {
    getGroupSavings {
      data
    }
  }
`;

export const GET_TOTAL_SOCIAL_FUNDS = gql`
  query {
    getTotalSocialFunds {
      data
    }
  }
`;

export const GET_TOTAL_NUMBER_OF_MEMBERS = gql`
  query {
    getTotalNumberOfMembers {
      data
    }
  }`

export const GET_TOTAL_LOAN_PROFITS = gql`
  query {
    getGroupLoansProfit {
      data
    }
  }`

export const GET_GROUP_TOTAL_DIVIDENDS = gql`
  query getTotalDividends($year: Int!) {
    getTotalDividends(year: $year) {
      data
    }
  }`

export const GET_CURRENT_MONTH_PENALTIES = gql`
  query getTotalPenaltiesByMonth($month: Month!, $year: Int!) {
    getTotalPenaltiesByMonth(month: $month, year: $year) {
      data
    }
  }`

export const GET_CONTRIBUTIONS_TOTAL_PENALTIES = gql`
  query getContributionTotalPenalties($month: Month!, $year: Int!) {
    getContributionTotalPenalties(month: $month, year: $year) {
      data
    }
  }`

export const GET_LOANS_TOTAL_PENALTIES = gql`
  query getLoanTotalPenalties($month: Month!, $year: Int!) {
    getLoanTotalPenalties(month: $month, year: $year) {
      data
    }
  }`

export const GET_CONTRIBUTIONS_BY_MONTH_AND_YEAR = gql`
  query getTotalContributionsByMonthAndYear($month: Month!, $year: Int!){
    getTotalContributionsByMonthAndYear(month: $month, year: $year) {
      data
    }
  }`

export const GET_TOTAL_DEBT = gql`
  query {
    getGroupStandingDebt {
      data
    }
  }`

export const GET_LOAN_PROFIT_BY_MONTH = gql`
  query getLoansProfitByMonth($month: Month!, $year: Int!) {
    getLoansProfitByMonth(month: $month, year: $year) {
      data
    }
  }`

export const GET_TOTAL_EXPENDITURES = gql`
  query {
    getTotalExpenditures {
      data
    }
  }`

interface Member {
  id: string;
  name: string;
  email: string;
  memberShares: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  stats = [
    { title: 'TOTAL MEMBERS', value: 0, link: '/member' },
    { title: 'TOTAL GROUP SAVINGS', value: 0 },
    { title: 'COMMUNITY FUND', value: 0, link: '/community-fund' },
    { title: 'TOTAL LOAN PROFITS', value: 0, link: '/loan' },
    { title: 'MONTHLY CONTRIBUTIONS', value: 0, link: '/contributions' },
    { title: 'LOAN PROFIT BY MONTH', value: 0, link: '/loan' },
    { title: 'TOTAL PENALTIES BY MONTH', value: 0 },
    { title: 'TOTAL DEBT', value: 0, link: '/loan' },
    { title: 'GROUP EXPENDITURES', value: 0, link: '/expenditures' },
    { title: 'CONTRIBUTIONS PENALTIES', value: 0, link: '/contributions' },
    { title: 'LOAN PENALTIES', value: 0, link: '/loan' },
    { title: 'YEARLY DIVIDENDS', value: 0, link: '/yearly-dividends' }
  ];

  months = [
    { name: 'January', value: 'JANUARY' },
    { name: 'February', value: 'FEBRUARY' },
    { name: 'March', value: 'MARCH' },
    { name: 'April', value: 'APRIL' },
    { name: 'May', value: 'MAY' },
    { name: 'June', value: 'JUNE' },
    { name: 'July', value: 'JULY' },
    { name: 'August', value: 'AUGUST' },
    { name: 'September', value: 'SEPTEMBER' },
    { name: 'October', value: 'OCTOBER' },
    { name: 'November', value: 'NOVEMBER' },
    { name: 'December', value: 'DECEMBER' }
  ];

  years: number[] = [];
  selectedMonth: string = '';
  selectedYear: number = new Date().getFullYear();
  isAdmin: boolean = false;
  shareData: any[] = []; // for graph data
  members: Member[] = [];
  isFullScreen = false;
  isDarkMode = false;

  colorScheme: string = 'vivid';

  constructor(private router: Router, private apollo: Apollo, private memberService: MemberService) { }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAdmin = this.user.isAdmin === true;
    } else {
      // Kama hakuna user info, rudisha login
      this.router.navigate(['/login']);
    }

    const now = new Date();
    this.selectedMonth = this.months[now.getMonth()].value;
    this.selectedYear = now.getFullYear();
    this.generateYears();
    this.loadMembers();
    // this.updateStatTitles();
    this.loadStats();

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();

  }

  toggleFullScreen(): void {
    const doc: any = document;
    const docEl: any = document.documentElement;

    if (!this.isFullScreen) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) { /* Safari */
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) { /* IE11 */
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) { /* Safari */
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { /* IE11 */
        doc.msExitFullscreen();
      }
    }

    this.isFullScreen = !this.isFullScreen;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  loadShareData() {
    this.shareData = this.members.map(member => ({
      name: member.name,
      value: member.memberShares
    }));
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
      this.loadShareData();
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 10; y--) {
      this.years.push(y);
    }
  }

  onDateChange() {
    // this.updateStatTitles();
    this.loadStats(); // reload stats with new month/year
  }

  viewUsers() {
    this.router.navigate(['/admin-page'])
  }

  loadStats(): void {
    const currentMonth = new Date().toISOString().slice(0, 7); // format: YYYY-MM

    this.apollo
      .watchQuery<any>({ query: GET_TOTAL_NUMBER_OF_MEMBERS })
      .valueChanges.subscribe(({ data }) => {
        this.stats[0].value = data.getTotalNumberOfMembers.data;
      });

    this.apollo
      .watchQuery<any>({ query: GET_GROUP_SAVINGS })
      .valueChanges.subscribe(({ data }) => {
        this.stats[1].value = data.getGroupSavings.data;
      });

    this.apollo
      .watchQuery<any>({ query: GET_TOTAL_SOCIAL_FUNDS })
      .valueChanges.subscribe(({ data }) => {
        this.stats[2].value = data.getTotalSocialFunds.data;
      });

    this.apollo
      .watchQuery<any>({ query: GET_TOTAL_LOAN_PROFITS })
      .valueChanges.subscribe(({ data }) => {
        this.stats[3].value = data.getGroupLoansProfit.data;
      });

    this.apollo
      .watchQuery<any>({
        query: GET_CONTRIBUTIONS_BY_MONTH_AND_YEAR,
        variables: {
          month: this.selectedMonth,
          year: this.selectedYear
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(({ data }) => {
        this.stats[4].value = data.getTotalContributionsByMonthAndYear.data;
      });

    this.apollo
      .watchQuery<any>({
        query: GET_LOAN_PROFIT_BY_MONTH,
        variables: {
          month: this.selectedMonth,
          year: this.selectedYear
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(({ data }) => {
        this.stats[5].value = data.getLoansProfitByMonth.data;
      });

    this.apollo
      .watchQuery<any>({
        query: GET_CURRENT_MONTH_PENALTIES,
        variables: {
          month: this.selectedMonth,
          year: this.selectedYear
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(({ data }) => {
        this.stats[6].value = data.getTotalPenaltiesByMonth.data;
      });

    this.apollo
      .watchQuery<any>({ query: GET_TOTAL_DEBT })
      .valueChanges.subscribe(({ data }) => {
        this.stats[7].value = data.getGroupStandingDebt.data;
      });

    this.apollo
      .watchQuery<any>({ query: GET_TOTAL_EXPENDITURES })
      .valueChanges.subscribe(({ data }) => {
        this.stats[8].value = data.getTotalExpenditures.data;
      });

    this.apollo
      .watchQuery<any>({
        query: GET_CONTRIBUTIONS_TOTAL_PENALTIES,
        variables: {
          month: this.selectedMonth,
          year: this.selectedYear
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(({ data }) => {
        this.stats[9].value = data.getContributionTotalPenalties.data;
      });

    this.apollo
      .watchQuery<any>({
        query: GET_LOANS_TOTAL_PENALTIES,
        variables: {
          month: this.selectedMonth,
          year: this.selectedYear
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(({ data }) => {
        this.stats[10].value = data.getLoanTotalPenalties.data;
      });

    this.apollo
      .watchQuery<any>({
        query: GET_GROUP_TOTAL_DIVIDENDS,
        variables: {
          month: this.selectedMonth,
          year: this.selectedYear
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe(({ data }) => {
        this.stats[11].value = data.getTotalDividends.data;
      });
  }
}
