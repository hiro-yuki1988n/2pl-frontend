import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CommunityFundService } from '../../services/community-fund.service';
import { CommunityFundDialogComponent } from '../community-fund-dialog/community-fund-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-community-fund',
  templateUrl: './community-fund.component.html',
  styleUrl: './community-fund.component.css'
})
export class CommunityFundComponent implements AfterViewInit {
  user: any;
  formData = {
    amount: 0,
    month: '',
    memberId: ''
  };

  months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  displayedColumns: string[] = ['position', 'name', 'amount', 'month', 'paymentDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router, 
    private apollo: Apollo, 
    private communityFundService: CommunityFundService,
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
    this.loadCommunityFynds();
  }

  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCommunityFynds(): void {
    this.communityFundService.getAllSocialFunds().subscribe((result: any) => {
      this.dataSource.data = result.data.getAllSocialFunds.data;
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

  editCommunityFund(communityFund: any): void {
      const dialogRef = this.dialog.open(CommunityFundDialogComponent, {
        width: '800px',
        data: communityFund || null // Send selected user data
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadCommunityFynds(); // Refresh list
        }
      });
    }
  
    deleteCommunityFund(communityFund: any) {
      const socialFundId = communityFund.id;
      if (confirm('Are you sure you want to delete this record?')) {
        this.communityFundService.deleteCommunityFund(socialFundId).subscribe({
          next: () => this.loadCommunityFynds(),
          error: err => console.error('Failed to delete community fund', err)
        });
      }
    }

    addCommunityFund(): void {
        const dialogRef = this.dialog.open(CommunityFundDialogComponent, { width: '1600px', maxWidth:'1000px' });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadCommunityFynds(); // Re-load contributions after saving
            console.log('Community fund saved successfully.');
          }
        });
      }
}

