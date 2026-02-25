import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderResponse } from '../../../models/order.model';
import { Order } from '../services/order';
import { AuthService } from '../../auth/services/auth.service';
import { Spinner } from '../../../../shared/components/spinner/spinner';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, Spinner, RouterModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  order: OrderResponse | null = null;
  loading: boolean = false;
  isProcessing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: Order,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchOrderDetails(+id);
      }
    });
  }

  fetchOrderDetails(id: number) {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Fetch Error:', err);
      },
    });
  }

  get canConfirm(): boolean {
    const user = this.authService.currentUser();
    if (!user || !this.order) return false;

    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const isStaff = roles.includes('Admin') || roles.includes('Driver');

    return isStaff && this.order.status !== 'Delivered' && this.order.status !== 'Cancelled';
  }

  confirmCompletion() {
    if (!this.order) return;

    Swal.fire({
      title: 'Confirm Delivery & Payment?',
      text: `Are you sure you delivered the items and received ${this.finalTotal} L.E?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Done!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isProcessing = true;
        this.orderService.completeOrder(this.order!.id).subscribe({
          next: () => {
            this.isProcessing = false;
            Swal.fire('Completed!', 'Order delivered successfully.', 'success');
            this.fetchOrderDetails(this.order!.id);
          },
          error: (err) => {
            this.isProcessing = false;
            Swal.fire('Error', err.error?.message || 'Update failed', 'error');
          },
        });
      }
    });
  }

  get finalTotal(): number {
    if (!this.order) return 0;
    const shippingFee = this.order.totalAmount >= 300 ? 0 : 30;
    return this.order.totalAmount + shippingFee;
  }
}
