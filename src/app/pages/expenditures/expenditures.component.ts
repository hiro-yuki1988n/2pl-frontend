import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ExpendituresService } from '../../services/expenditures.service';
import { MatSort } from '@angular/material/sort';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrl: './expenditures.component.css'
})
export class ExpendituresComponent {
  user: any;
  displayedColumns: string[] = ['id', 'amount', 'dateIssued', 'expenseType', 'description', 'isApproved', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private expendituresService: ExpendituresService
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAdmin = this.user.isAdmin === true;
      this.loggedInUserId = this.user.member.id; // au this.user.userId; kulingana na structure
    } else {
      // Kama hakuna user info, rudisha login
      this.router.navigate(['/login']);
    }
    this.loadExpenditures();
  }

  home() {
    this.router.navigate(['/home']);
  }

  changePassword(){
    this.router.navigate(['/change-password']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  loadExpenditures(): void {
    this.expendituresService.getExpenditures().subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.data.getExpenditures.data);
      this.dataSource.paginator = this.paginator;
    });
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

  editExpense(expenditure: any): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      width: '800px',
      data: expenditure || null // Send selected user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpenditures(); // Refresh list
      }
    });
  }

  deleteExpense(expenditure: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.expendituresService.deleteExpense(expenditure.id).subscribe({
        next: () => this.loadExpenditures(),
        error: err => console.error('Failed to delete expenditure', err)
      });
    }
  }

  approveExpense(expenditure: any): void {
    if (confirm('Are you sure you want to approve this expenditure?')) {
      this.expendituresService.approveExpenditure(expenditure.id).subscribe({
        next: (res: any) => {
          alert('Expenditure approved successfully.');
          // this.loadExpenditures(); // Reload the list to reflect change
          expenditure.isApproved = true;
        },
        error: err => {
          console.error('Approval failed:', err);
          alert('Failed to approve expenditure: ' + err.message);
        }
      });
    }
  }

  addExpenditure(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, { width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpenditures(); // Re-load contributions after saving
        console.log('Expenditure saved successfully.');
      }
    });
  }
}
