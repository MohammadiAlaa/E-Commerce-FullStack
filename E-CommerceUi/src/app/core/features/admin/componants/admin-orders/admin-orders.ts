import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AdminService } from '../../services/admin.service';

import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';

import { Shipping, User } from '../../../../models/admin.models';

@Component({
  selector: 'app-admin-orders',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './admin-orders.html',

  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  shippings: Shipping[] = [];

  statusOptions = ['Pending', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled'];

  drivers: User[] = [];

  constructor(
    private adminService: AdminService,

    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadShippings();

    this.loadDrivers();
  }

  loadDrivers() {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.drivers = users.filter((u) => u.roles && u.roles.includes('Driver'));

        this.cdr.detectChanges();
      },

      error: (err) => console.error('Error loading drivers', err),
    });
  }

  onAssignDriver(shippingId: number, event: any) {
    const driverId = event.target.value;

    if (!driverId) return;

    this.adminService.assignDriver(shippingId, driverId).subscribe({
      next: () => {
        Swal.fire('Assigned!', 'Driver has been linked to this order.', 'success');

        this.loadShippings();
      },

      error: () => Swal.fire('Error', 'Failed to assign driver', 'error'),
    });
  }

  loadShippings() {
    this.adminService.getAllShippings().subscribe({
      next: (res: Shipping[]) => {
        this.shippings = [...res];

        this.cdr.detectChanges();
      },

      error: () => Swal.fire('Error', 'Failed to load shippings', 'error'),
    });
  }

  updateStatus(id: number, event: any) {
    const newStatus = event.target.value;

    if (newStatus === 'Cancelled') {
      Swal.fire({
        title: 'Cancel Order',
        input: 'textarea',
        inputLabel: 'Reason for cancellation',
        inputPlaceholder: 'Enter why this order is cancelled...',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Confirm Cancellation',
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('Reason is required!');
          }
          return value;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeStatusUpdate(id, newStatus, result.value);
        } else {
          this.loadShippings();
        }
      });
    } else {
      this.executeStatusUpdate(id, newStatus);
    }
  }

  private executeStatusUpdate(id: number, status: string, reason?: string) {
    this.adminService.updateShippingStatus(id, status, reason).subscribe({
      next: () => {
        Swal.fire('Updated!', `Order is now ${status}`, 'success');
        this.loadShippings();
        this.cdr.detectChanges();
      },

      error: (err) => {
        Swal.fire('Error', err.error || 'Update failed', 'error');
        this.loadShippings();
      },
    });
  }

  viewCancelReason(reason: string) {
    Swal.fire({
      title: 'Cancellation Reason',
      text: reason,
      icon: 'warning',
      confirmButtonColor: '#dc3545',
    });
  }
}
