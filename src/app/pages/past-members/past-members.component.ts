import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MemberService } from '../../services/member.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { RemoveMemberDialogComponent } from '../remove-member-dialog/remove-member-dialog.component';

@Component({
  selector: 'app-past-members',
  templateUrl: './past-members.component.html',
  styleUrl: './past-members.component.css'
})
export class PastMembersComponent {
  displayedColumns: string[] = ['id', 'name', 'gender', 'phone', 'joiningDate', 'role', 'isActive', 'removedAt', 'reason', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;
  loading = false;
  user: any;
  member: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private memberService: MemberService,
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

    this.loadPastMembers();
  }

  loadPastMembers(): void {
    this.memberService.getPastMembers().subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.data.getPastMembers.data);
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

  removeMember(): void {
    const dialogRef = this.dialog.open(RemoveMemberDialogComponent, {
      width: '1600px',
      maxWidth: '1000px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPastMembers(); // Re-load contributions after saving
        console.log('Contribution saved successfully.');
      }
    });
  }

restoreMember(member: any) {
  if (confirm('Are you sure you want to restore this member?')) {
      this.memberService.restoreMember(member.id).subscribe({
        next: () => this.loadPastMembers(),
        error: err => console.error('Failed to delete user', err)
      });
    }
}
}
