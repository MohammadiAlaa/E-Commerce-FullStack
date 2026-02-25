import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Shipping } from '../../../models/admin.models';
import { AdminService } from '../../admin/services/admin.service';

@Component({
  selector: 'app-driver-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-orders.html',
  styleUrl: './driver-orders.css',
})
export class DriverOrders implements OnInit {
  myDeliveries: Shipping[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.loadAssignedOrders();
  }

  loadAssignedOrders() {
    this.loading = true;
    this.adminService.getMyTasks().subscribe({
      next: (res) => {
        this.myDeliveries = res.filter((d) => d.status !== 'Delivered' && d.status !== 'Cancelled');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire('Sync Error', 'Could not refresh your task list.', 'error');
      },
    });
  }

  startDelivery(shipId: number) {
    Swal.fire({
      title: 'Start Delivery?',
      text: 'Are you leaving to deliver this order now?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#0dcaf0',
      confirmButtonText: 'Yes, Out for Delivery',
    }).then((result) => {
      if (result.isConfirmed) {
        this.zone.run(() => {
          this.updateStatus(shipId, 'OutForDelivery', 'Order is on its way!');
        });
      }
    });
  }

  markAsDelivered(shipId: number) {
    Swal.fire({
      title: 'Confirm Delivery',
      text: 'Did you hand the package to the customer?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      confirmButtonText: 'Yes, Delivered!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.zone.run(() => {
          this.updateStatus(shipId, 'Delivered', 'Great Job!');
        });
      }
    });
  }

  private updateStatus(shipId: number, status: string, successTitle: string) {
    this.adminService.updateShippingStatus(shipId, status).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: successTitle,
          timer: 1500,
          showConfirmButton: false,
        });
        this.loadAssignedOrders();
      },
      error: () => Swal.fire('Error', 'Failed to update status.', 'error'),
    });
  }

  cancelOrder(shipId: number) {
    Swal.fire({
      title: 'Cancel Shipment',
      input: 'textarea',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'e.g., Customer unreachable...',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      preConfirm: (reason) => reason || Swal.showValidationMessage('A reason is required!'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.zone.run(() => {
          this.adminService.updateShippingStatus(shipId, 'Cancelled', result.value).subscribe({
            next: () => {
              Swal.fire('Updated', 'Task marked as cancelled.', 'info');
              this.loadAssignedOrders();
            },
            error: () => Swal.fire('Error', 'Update failed.', 'error'),
          });
        });
      }
    });
  }
}
