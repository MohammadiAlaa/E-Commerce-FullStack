import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthModel, LoginDto, RegisterDto } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7247/api/Accounts';
  currentUser = signal<AuthModel | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUser();
  }

  register(dto: RegisterDto) {
    return this.http.post(`${this.baseUrl}/Register`, dto);
  }

  login(dto: LoginDto) {
    return this.http.post<AuthModel>(`${this.baseUrl}/Login`, dto).pipe(
      tap((res) => {
        if (res.isAuthenticated) {
          localStorage.setItem('token', res.token);
          this.currentUser.set(res);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/ForgotPassword`, { email });
  }

  resetPassword(dto: any) {
    return this.http.post(`${this.baseUrl}/ResetPassword`, dto);
  }

  deleteProfile() {
    return this.http.delete(`${this.baseUrl}/DeleteProfile`);
  }

  private loadUser() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

        if (!isTokenExpired) {
          this.currentUser.set({
            isAuthenticated: true,
            token: token,
            username:
              decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
              decodedToken.sub,
            email:
              decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            roles:
              decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [],
            expiresOn: new Date(decodedToken.exp * 1000).toISOString(),
            massege: '',
          });
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Invalid token', error);
        this.logout();
      }
    }
  }
}
