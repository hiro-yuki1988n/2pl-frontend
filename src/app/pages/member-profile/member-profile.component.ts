import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../services/member.service';
import { ContributionService } from '../../services/contribution.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommunityFundService } from '../../services/community-fund.service';
import { LoanService } from '../../services/loan.service';
import { MatDialog } from '@angular/material/dialog';
import { DividendDialogComponent } from '../dividend-dialog/dividend-dialog.component';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.css'
})
export class MemberProfileComponent {
  user: any;
  memberId: number | null = null;
  memberShares: number | null = null;
  memberContributions: number | null = null;
  memberSocialFunds: number | null = null;
  memberStandingLoans: number | null = null;
  memberLoanPayments: number | null = null;
  memberPenalties: number | null = null;
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  selectedMember: any;
  dividend: any;
  photoBase64: string = '';
  selectedFile!: File;
  isWithdrawPeriod = false;

  displayedColumns: string[] = ['id', 'name', 'amount', 'paymentDate', 'month', 'penaltyAmount'];
  cfDisplayedColumns: string[] = ['id', 'name', 'amount', 'paymentDate', 'month'];
  lDisplayedColumns: string[] = ['id', 'name', 'amount', 'interestRate', 'startDate', 'dueDate', 'isPaid', 'penalty', 'payableAmount'];
  lpDisplayedColumns: string[] = ['id', 'name', 'amount', 'amountPaid', 'payDate', 'description'];
  pDisplayedColumns: string[] = ['id', 'name', 'amount', 'dueDate', 'penalty'];
  ydDisplayedColumns: string[] = ['id', 'name', 'allocatedAmount', 'withdrawnAmount', 'remainingBalance', 'approved', 'year'];

  dataSource = new MatTableDataSource<any>([]);
  cfdataSource = new MatTableDataSource<any>([]);
  ldataSource = new MatTableDataSource<any>([]);
  lpdataSource = new MatTableDataSource<any>([]);
  lcDataSource = new MatTableDataSource<any>([]);
  lContriDataSource = new MatTableDataSource<any>([]);
  lPaidLoanDataSource = new MatTableDataSource<any>([]);
  yddataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private route: ActivatedRoute,
    private memberService: MemberService,
    private contributionService: ContributionService,
    private router: Router,
    private communityFundService: CommunityFundService,
    private loanService: LoanService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // Kama hakuna user info, rudisha login
      this.router.navigate(['/login']);
    }

    const filename = this.user?.member?.passportPhoto;

    if (filename) {
      this.memberService.getMemberPhoto(filename).subscribe({
        next: (res) => {
          const base64 = res.data.getMemberPhoto.data;
          this.photoBase64 = 'data:image/jpeg;base64,' + base64;
        },
        error: () => {
          this.photoBase64 = '';
        }
      });
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    this.memberId = idParam !== null ? Number(idParam) : null;


    this.initializeYears();

    if (this.memberId) {
      this.loadShares(this.memberId, this.selectedYear);
      this.loadTotalMemberContributions(this.memberId, this.selectedYear);
      this.loadContibutionsByMember(this.memberId, this.selectedYear);
      this.loadCommunityFundsByMember(this.memberId, this.selectedYear);
      this.loadTotalMemberCommunityFunds(this.memberId, this.selectedYear);
      this.loadTotalMemberLoans(this.memberId, this.selectedYear);
      this.loadLoansByMember(this.memberId, this.selectedYear);
      this.loadLoansPaymentByMember(this.memberId, this.selectedYear);
      this.loadTotalMemberPenalties(this.memberId, this.selectedYear);
      this.loadDividendsByMember(this.memberId, this.selectedYear);
    }

    const now = new Date();
    const month = now.getMonth() + 1; // January = 0, so add 1
    const day = now.getDate();

    // Ruhusu withdraw kuanzia Dec 1 hadi Dec 31
    if (month === 12 && day >= 1 && day <= 31) {
      this.isWithdrawPeriod = true;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 10; y--) {
      this.years.push(y);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
    if (this.selectedFile && this.user?.member?.id) {
      this.memberService.uploadMemberPhoto(this.user.member.id, this.selectedFile).subscribe({
        next: () => {
          alert('Photo uploaded!');
          window.location.reload(); // or re-fetch the image
        },
        error: () => alert('Failed to upload photo')
      });
    }
  }

  onDateChange(): void {
    if (this.memberId) {
      this.loadShares(this.memberId, this.selectedYear);
      this.loadTotalMemberContributions(this.memberId, this.selectedYear);
      this.loadContibutionsByMember(this.memberId, this.selectedYear);
      this.loadCommunityFundsByMember(this.memberId, this.selectedYear);
      this.loadTotalMemberCommunityFunds(this.memberId, this.selectedYear);
      this.loadTotalMemberLoans(this.memberId, this.selectedYear);
      this.loadLoansByMember(this.memberId, this.selectedYear);
      this.loadLoansPaymentByMember(this.memberId, this.selectedYear);
      this.loadTotalMemberPenalties(this.memberId, this.selectedYear);
      this.loadDividendsByMember(this.memberId, this.selectedYear);
    }
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.cfdataSource.sort = this.sort;
    this.ldataSource.sort = this.sort;
    this.lpdataSource.sort = this.sort;
    this.yddataSource.sort = this.sort;
  }

  loadShares(memberId: number, year: number): void {
    this.memberShares = null; // Reset while loading
    this.memberService.getTotalMemberSharesByYear(memberId, year).subscribe({
      next: (res: any) => {
        this.memberShares = res.data.getTotalMemberSharesByYear.data;
      },
      error: (err) => {
        console.error('Error loading shares', err);
        this.memberShares = 0;
      }
    });
  }

  loadTotalMemberContributions(memberId: number, year: number): void {
    this.memberContributions = null; // Reset while loading
    this.contributionService.getTotalMemberContributions(memberId, year).subscribe({
      next: (res: any) => {
        this.memberContributions = res.data.getTotalMemberContributions.data;
      },
      error: (err) => {
        console.error('Error loading shares', err);
        this.memberContributions = 0;
      }
    });
  }

  loadTotalMemberCommunityFunds(memberId: number, year: number): void {
    this.memberSocialFunds = null; // Reset while loading
    this.communityFundService.getTotalSocialFundsByMember(memberId, year).subscribe({
      next: (res: any) => {
        this.memberSocialFunds = res.data.getTotalSocialFundsByMember.data;
      },
      error: (err) => {
        console.error('Error loading shares', err);
        this.memberSocialFunds = 0;
      }
    });
  }

  loadTotalMemberLoans(memberId: number, year: number): void {
    this.memberStandingLoans = null; // Reset while loading
    this.loanService.getTotalLoansByMember(memberId, year).subscribe({
      next: (res: any) => {
        this.memberStandingLoans = res.data.getTotalLoansByMember.data;
      },
      error: (err) => {
        console.error('Error loading shares', err);
        this.memberStandingLoans = 0;
      }
    });
  }

  loadTotalMemberPenalties(memberId: number, year: number): void {
    this.memberPenalties = null; // Reset while loading
    this.loanService.getTotalPenaltiesByMember(memberId, year).subscribe({
      next: (res: any) => {
        this.memberPenalties = res.data.getTotalPenaltiesByMember.data;
      },
      error: (err) => {
        console.error('Error loading shares', err);
        this.memberPenalties = 0;
      }
    });
  }

  loadContibutionsByMember(memberId: number, year: number): void {
    this.contributionService.getContributionsByMember(memberId, year).subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.data.getContributionsByMember.data);
      this.dataSource.paginator = this.paginator;
    });

    this.contributionService.getLateContributionsByMember(memberId, year).subscribe((result: any) => {
      this.lContriDataSource = new MatTableDataSource(result.data.getLateContributionsByMember.data);
      this.lContriDataSource.paginator = this.paginator;
    });
  }

  loadCommunityFundsByMember(memberId: number, year: number): void {
    this.communityFundService.getSocialFundsByMember(memberId, year).subscribe((result: any) => {
      this.cfdataSource = new MatTableDataSource(result.data.getSocialFundsByMember.data);
      this.cfdataSource.paginator = this.paginator;
    });
  }

  loadLoansByMember(memberId: number, year: number): void {
    this.loanService.getLoanByMember(memberId, year).subscribe((result: any) => {
      this.ldataSource = new MatTableDataSource(result.data.getLoanByMember.data);
      this.ldataSource.paginator = this.paginator;
    });

    this.loanService.getLatePaidLoansByMember(memberId, year).subscribe((result: any) => {
      this.lPaidLoanDataSource = new MatTableDataSource(result.data.getLatePaidLoansByMember.data);
      this.lPaidLoanDataSource.paginator = this.paginator;
    });
  }

  loadLoansPaymentByMember(memberId: number, year: number): void {
    this.loanService.getLoanPaymentsByMember(memberId, year).subscribe((result: any) => {
      this.lpdataSource = new MatTableDataSource(result.data.getLoanPaymentsByMember.data);
      this.lpdataSource.paginator = this.paginator;
    });
  }

  withdraw(): void {
    if (!this.user?.member || this.memberShares === null) {
      return;
    }

    const dialogRef = this.dialog.open(DividendDialogComponent, {
      width: '1600px',
      maxWidth: '1000px',
      data: {
        memberId: this.memberId,
        memberName: this.user?.member?.name || '',
        allocatedAmount: this.memberShares || 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDividends(); // refresh dividends if needed
      }
    });
  }

  loadDividends() { }

  loadDividendsByMember(memberId: number, year: number): void {
    this.contributionService.getYearlyDividendByMember(memberId, year).subscribe((result: any) => {
      this.yddataSource = new MatTableDataSource(result.data.getYearlyDividendByMember.data);
      this.yddataSource.paginator = this.paginator;
    });
  }

}
