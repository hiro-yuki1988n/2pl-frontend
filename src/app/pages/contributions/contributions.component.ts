import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ContributionService } from '../../services/contribution.service';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ContributionDialogComponent } from '../contribution-dialog/contribution-dialog.component';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.css'
})
export class ContributionsComponent {
  user: any;
  displayedColumns: string[] = ['id', 'name', 'amount', 'paymentDate', 'month', 'penaltyAmount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private contributionService: ContributionService,
    private dialog: MatDialog
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
    this.loadContibutions();
  }

  home() {
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  loadContibutions(): void {
    this.contributionService.getContributions().subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.data.getContributions.data);
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

  viewMore(member: any) {
    this.router.navigate(['/member-profile', member.id]);
  }

  changePassword(){
    this.router.navigate(['/change-password']);
  }

  editCntrib(contribution: any): void {
    const dialogRef = this.dialog.open(ContributionDialogComponent, {
      width: '800px',
      data: contribution || null // Send selected user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContibutions(); // Refresh list
      }
    });
  }

  deleteContribution(contribution: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.contributionService.deleteContribution(contribution.id).subscribe({
        next: () => this.loadContibutions(),
        error: err => console.error('Failed to delete contribution', err)
      });
    }
  }

  addContribution(): void {
    const dialogRef = this.dialog.open(ContributionDialogComponent, {
      width: '1600px',
      maxWidth: '1000px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadContibutions(); // Re-load contributions after saving
        console.log('Contribution saved successfully.');
      }
    });
  }
}
