import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/features/auth/services/auth.service';
import { CartService } from '../../../core/features/cart/services/cart.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  cartCount$: Observable<number>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.cartCount$ = this.cartService.cartCounter$;
  }

  ngOnInit(): void {
    if (this.isLoggedIn && !this.isAdmin) {
      this.cartService.getCart().subscribe({
        next: () => this.cdr.detectChanges(),
      });
    }
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }

  get isDriver(): boolean {
    return localStorage.getItem('role') === 'Driver';
  }

  get isCustomer(): boolean {
    return this.isLoggedIn && !this.isAdmin && !this.isDriver;
  }

  onLogout() {
    this.authService.logout();
  }

  confirmDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your profile!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteProfile().subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your account is gone.', 'success');
            this.authService.logout();
          },
        });
      }
    });
  }
}
