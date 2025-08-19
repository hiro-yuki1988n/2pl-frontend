import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MemberService } from '../../services/member.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CreateMemberComponent } from '../create-member/create-member.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrl: './member.component.css'
})
export class MemberComponent {
  user: any;
  displayedColumns: string[] = ['id', 'name', 'gender', 'email', 'phone', 'joiningDate', 'shares', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  total = 0;
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

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
      // Kama hakuna user info, rudisha login
      this.router.navigate(['/login']);
    }
    this.loadMembers();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.data.getMkobaMembers.data);
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

  viewMore(member: any) {
    this.router.navigate(['/member-profile', member.id]);
  }

  changePassword(){
    this.router.navigate(['/change-password']);
  }

  editMember(member: any): void {
    const dialogRef = this.dialog.open(CreateMemberComponent, {
      width: '1600px',
      maxWidth: '1000px',
      data: member || null // Send selected user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers(); // Refresh list
      }
    });
  }

  deleteMember(member: any) {
    const memberId = member.id; // 👈 Extract id explicitly
    if (confirm('Are you sure you want to delete this user?')) {
      this.memberService.deleteMember(memberId).subscribe({
        next: () => this.loadMembers(),
        error: err => console.error('Failed to delete member', err)
      });
    }
  }

  addMember(): void {
    const dialogRef = this.dialog.open(CreateMemberComponent, {
      width: '1600px',
      maxWidth: '1000px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
        console.log('New member data:', result);
      }
    });
  }

}
