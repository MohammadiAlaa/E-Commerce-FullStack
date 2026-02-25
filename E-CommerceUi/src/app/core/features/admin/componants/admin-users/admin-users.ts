import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/admin.models';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  roles = ['Admin', 'User', 'Driver', 'Accountant'];
  loading = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => (this.loading = false),
    });
  }

  changeRole(userId: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const roleName = selectElement.value;

    this.adminService.assignRole(userId, roleName).subscribe({
      next: () => Swal.fire('Updated!', 'User role has been changed.', 'success'),
      error: (err) => Swal.fire('Error', err.error || 'Failed to change role', 'error'),
    });
  }

  toggleBlock(user: User) {
    this.adminService.toggleUserBlock(user.id).subscribe(() => {
      user.isBlocked = !user.isBlocked;
      Swal.fire('Success', user.isBlocked ? 'User Blocked' : 'User Unblocked', 'info');
    });
  }
}
