import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthModel } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: AuthModel) => {
          this.loading = false;

          if (res.roles && res.roles.length > 0) {
            localStorage.setItem('role', res.roles[0]);
          }

          if (res.roles.includes('Admin')) {
            this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
          } else if (res.roles.includes('Driver')) {
            this.router.navigate(['/admin/driver-tasks'], { replaceUrl: true });
          } else {
            this.router.navigate(['/products'], { replaceUrl: true });
          }
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Error', 'Invalid email or password', 'error');
        },
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
