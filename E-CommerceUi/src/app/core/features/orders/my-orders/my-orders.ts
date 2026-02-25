import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../models/order.model';
import { CommonModule } from '@angular/common';
import { Spinner } from '../../../../shared/components/spinner/spinner';
import { RouterModule } from '@angular/router';
import { Order } from '../services/order';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, Spinner, RouterModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders: OrderResponse[] = [];
  loading: boolean = false;

  constructor(
    private orderService: Order,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching orders:', err);
      },
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending':
        return 'badge bg-warning text-dark';
      case 'Processing':
        return 'badge bg-info text-white';
      case 'Shipped':
      case 'OutForDelivery':
        return 'badge bg-primary text-white';
      case 'Delivered':
      case 'Completed':
        return 'badge bg-success text-white';
      case 'Cancelled':
        return 'badge bg-danger text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }
}
