// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: any;
  token: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl = 'http://localhost:7080/api/auth';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl + "/api/auth"}/login`, request);
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl + "/api/auth"}/change-password`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUgser(): any {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}

