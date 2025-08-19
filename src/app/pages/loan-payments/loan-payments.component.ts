import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { LoanService } from '../../services/loan.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { PayLoanDialogComponent } from '../pay-loan-dialog/pay-loan-dialog.component';

@Component({
  selector: 'app-loan-payments',
  templateUrl: './loan-payments.component.html',
  styleUrl: './loan-payments.component.css'
})
export class LoanPaymentsComponent {
  user: any;
    displayedColumns: string[] = ['id', 'member', 'loanAmount', 'amountToBePaid', 'payDate', 'description', 'actions'];
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
  
      this.loadLoanPayments();
    }
  
    home() {
      this.router.navigate(['/home']);
    }
  
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }

    changePassword(){
    this.router.navigate(['/change-password']);
  }
  
    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    @ViewChild(MatSort) sort!: MatSort;
  
    ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
    }
  
    viewMore(member: any) {
      this.router.navigate(['/member-profile', member.id]);
    }
  
    loadLoanPayments(): void {
      this.loanService.getLoanPayments().subscribe((result: any) => {
        this.dataSource = new MatTableDataSource(result.data.getLoanPayments.data);
        this.dataSource.paginator = this.paginator;
      });
    }
  
    editLoanPayment(loanPayment: any): void {
        const dialogRef = this.dialog.open(PayLoanDialogComponent, {
          width: '800px',
          data: loanPayment || null // Send selected user data
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadLoanPayments(); // Refresh list
          }
        });
      }
      
      deleteLoanPayment(loanPayment: any) {
        if (confirm('Are you sure you want to delete this record?')) {
          this.loanService.deleteLoanPayment(loanPayment.id).subscribe({
            next: () => this.loadLoanPayments(),
            error: err => console.error('Failed to delete loan payment', err)
          });
        }
      } 
}
