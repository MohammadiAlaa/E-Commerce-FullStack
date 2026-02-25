import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  emailForm: FormGroup;
  resetForm: FormGroup;
  step: number = 1;
  loading: boolean = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  sendOTP() {
    if (this.emailForm.valid) {
      this.loading = true;
      this.auth.forgotPassword(this.emailForm.value.email).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.step = 2;
          this.resetForm.patchValue({ email: this.emailForm.value.email });
          this.cdr.detectChanges();
          Swal.fire('Success', 'Check your email for OTP', 'success');
        },
        error: (err) => {
          this.loading = false;
          const errorMessage = typeof err.error === 'string' ? err.error : 'User not found';
          Swal.fire('Error', errorMessage, 'error');
        },
      });
    }
  }

  resetPassword() {
    if (this.resetForm.valid) {
      this.loading = true;
      console.log('Sending Data:', this.resetForm.value);

      this.auth.resetPassword(this.resetForm.value).subscribe({
        next: (res: any) => {
          this.loading = false;
          Swal.fire('Great!', 'Password changed successfully', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          const errorMessage =
            typeof err.error === 'string' ? err.error : err.error?.message || 'Invalid OTP or Data';
          Swal.fire('Error', errorMessage, 'error');
        },
      });
    }
  }
}
