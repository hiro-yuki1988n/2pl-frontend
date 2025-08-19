import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MemberService } from '../../services/member.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { CreateUserComponent } from '../create-user/create-user.component';
import { CommonFundService } from '../../services/common-fund.service';
import { CommonFundDialogComponent } from '../common-fund-dialog/common-fund-dialog.component';

@Component({
  selector: 'app-common-funds',
  templateUrl: './common-funds.component.html',
  styleUrl: './common-funds.component.css'
})
export class CommonFundsComponent {
  displayedColumns: string[] = ['position', 'amount', 'sourceType', 'entryDate','description', 'actions' ];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;
  commonFunds: any[] = [];
  commonFund: any;
  loading = false;
  user: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private memberService: MemberService,
    private commonFundService: CommonFundService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.loggedInUserId = this.user.member.id;
      this.isAdmin = this.user.isAdmin === true;
    } else {
      this.router.navigate(['/login']);
    }

    this.loadCommonFunds();
  }

  loadCommonFunds(): void {
    this.commonFundService.getCommonFunds().subscribe((commonFunds: any[]) => {
      this.dataSource = new MatTableDataSource(commonFunds);
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
  }

  addCommonFund(): void {
    const dialogRef = this.dialog.open(CommonFundDialogComponent, { 
      width: '1600px', 
      maxWidth: '1000px' 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCommonFunds();
        console.log('Data saved successfully.');
      }
    });
  }

  editCommonFund(user: any): void {
    const dialogRef = this.dialog.open(CommonFundDialogComponent, {
      width: '1600px', 
      maxWidth: '1000px',
      data: user || null // Send selected user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCommonFunds(); // Refresh list
      }
    });
  }

  deleteCommonFund(commonFund: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.commonFundService.deleteCommonFund(commonFund.id).subscribe({
        next: () => this.loadCommonFunds(),
        error: err => console.error('Failed to delete common fund', err)
      });
    }
  }
}
