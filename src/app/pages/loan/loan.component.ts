import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { LoanService } from '../../services/loan.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LoanDialogComponent } from '../loan-dialog/loan-dialog.component';
import { PayLoanDialogComponent } from '../pay-loan-dialog/pay-loan-dialog.component';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent {
  user: any;
  displayedColumns: string[] = ['id', 'name', 'amount', 'interestRate', 'startDate', 'dueDate', 'isPaid', 'penalty', 'payableAmount', 'unpaidAmount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private loanService: LoanService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAdmin = this.user.isAdmin === true;
      this.loggedInUserId = this.user.member.id; // au this.user.userId; kulingana na structure
    } else {
      this.router.navigate(['/login']);
    }

    this.loadListOfLoans();
  }

  home() {
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  viewMore(member: any) {
    this.router.navigate(['/member-profile', member.id]);
  }

  changePassword(){
    this.router.navigate(['/change-password']);
  }

  loadListOfLoans(): void {
    this.loanService.getMembersLoans().subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.data.getMembersLoans.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  editLoan(loan: any): void {
      const dialogRef = this.dialog.open(LoanDialogComponent, {
        width: '800px',
        data: loan || null // Send selected user data
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadListOfLoans(); // Refresh list
        }
      });
    }

    deleteLoan(loan: any) {
      if (confirm('Are you sure you want to delete this record?')) {
        this.loanService.deleteMemberLoan(loan.id).subscribe({
          next: () => this.loadListOfLoans(),
          error: err => console.error('Failed to delete loan', err)
        });
      }
    }
  
    addLoan(): void {
      const dialogRef = this.dialog.open(LoanDialogComponent, { width: '800px' });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadListOfLoans(); // Re-load contributions after saving
          console.log('Loan saved successfully.');
        }
      });
    }

    payLoan(loan: any): void {
        const dialogRef = this.dialog.open(PayLoanDialogComponent, {
          width: '800px',
          data: loan || null // Send selected user data
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadListOfLoans();
            console.log('Successful payment.');
          }
        });
      }

    viewLoanPayments(){
      this.router.navigate(['/loan-payments']);
    }
}
