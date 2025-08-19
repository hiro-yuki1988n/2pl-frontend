import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { MemberService } from '../../services/member.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { CreateUserComponent } from '../create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  user: any;
  users: any[] = [];
  displayedColumns: string[] = ['position', 'name', 'username', 'phone', 'isAdmin', 'actions'];
  loading = false;
  dataSource = new MatTableDataSource<any>([]);
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private memberService: MemberService,
    private userService: UserService,
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

    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    });
  }

  home() {
    this.router.navigate(['/home']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  // viewMore(member: any) {
  //   this.router.navigate(['/member-profile', member.id]);
  // }

  addUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, { width: '800px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        console.log('User saved successfully.');
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      data: user || null // Send selected user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh list
      }
    });
  } 

  disableUser(user: any): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '800px',
      data: user || null // Send selected user data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh list
      }
    });
  }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Failed to delete user', err)
      });
    }
  }
}
