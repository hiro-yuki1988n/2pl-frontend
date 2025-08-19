import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InsertEntryFeeComponent } from '../insert-entry-fee/insert-entry-fee.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  user: any;
  users: any[] = [];
  loading = false;
  loggedInUserId: number | null = null;
  isAdmin: boolean = false;

  constructor(private router: Router,
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
  }

  home() {
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  insertEntryFee(): void {
      const dialogRef = this.dialog.open(InsertEntryFeeComponent, {
        width: '1600px',
        maxWidth: '1000px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/contributions']); // Refresh list
        }
      });
    }

}
