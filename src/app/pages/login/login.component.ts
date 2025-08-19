import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
  
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
  
        this.router.navigate(['/home']);
      },
      error: () => {
        this.snackBar.open('Invalid credentials', 'Close', { duration: 3000 });
      }
    });
  }
}