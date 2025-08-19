import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { DividendDialogComponent } from '../dividend-dialog/dividend-dialog.component';
import { ContributionService } from '../../services/contribution.service';

@Component({
  selector: 'app-yearly-dividends',
  templateUrl: './yearly-dividends.component.html',
  styleUrl: './yearly-dividends.component.css'
})
export class YearlyDividendsComponent implements AfterViewInit{
user: any;
  formData = {
    amount: 0,
    month: '',
    memberId: ''
  };
  memberId: number | null = null;
  memberShares: number | null = null;
  displayedColumns: string[] = ['id', 'name', 'allocatedAmount', 'withdrawnAmount', 'remainingBalance', 'approved', 'year', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router, 
    private apollo: Apollo, 
    private contributionService: ContributionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAdmin = this.user.isAdmin === true;
      this.loggedInUserId = this.user.member.id;
    } else {
      this.router.navigate(['/login']);
    }
    this.loadYearlyDividends();
  }

  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadYearlyDividends(): void {
    this.contributionService.getYearlyDividends().subscribe((result: any) => {
      this.dataSource.data = result.data.getYearlyDividends.data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    this.router.navigate(['/login']);
  }

  changePassword(){
    this.router.navigate(['/change-password']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  viewMore(member: any) {
    this.router.navigate(['/member-profile', member.id]);
  }

  editYearlyDividend(yearlyDividend: any): void {
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
          this.loadYearlyDividends(); // Refresh list
        }
      });
    }

    approveDividend(yearlyDividend: any): void {
    if (confirm('Are you sure you want to approve this expenditure?')) {
      this.contributionService.approveDividend(yearlyDividend.id).subscribe({
        next: (res: any) => {
          yearlyDividend.isApproved = true;
          this.loadYearlyDividends();
          alert('Member dividend approved successfully.');
        },
        error: err => {
          console.error('Approval failed:', err);
          alert('Failed to approve Member Dividend: ' + err.message);
        }
      });
    }
  }
  
    deleteYearlyDividend(yearlyDividend: any) {
      const yearlyDividendId = yearlyDividend.id;
      if (confirm('Are you sure you want to delete this record?')) {
        this.contributionService.deleteYearlyDividend(yearlyDividendId).subscribe({
          next: () => this.loadYearlyDividends(),
          error: err => console.error('Failed to delete dividend', err)
        });
      }
    }
}
