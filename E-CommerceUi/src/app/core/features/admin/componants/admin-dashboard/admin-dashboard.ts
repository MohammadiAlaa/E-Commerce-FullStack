import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Spinner } from '../../../../../shared/components/spinner/spinner';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DashboardStats, TopProduct } from '../../../../models/admin.models';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Spinner, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: DashboardStats | null = null;
  topProducts: TopProduct[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    forkJoin({
      stats: this.adminService.getStats(),
      topSelling: this.adminService.getTopSelling(),
    }).subscribe({
      next: (res) => {
        this.stats = res.stats;
        this.topProducts = res.topSelling;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: err.error?.message || 'Server is not responding. Check your API.',
          confirmButtonColor: '#e74a3b',
        });
      },
    });
  }

  showCancelReason(reason: string) {
    Swal.fire({
      title: 'Cancellation Reason',
      text: reason || 'No reason provided by the driver.',
      icon: 'info',
      confirmButtonColor: '#4e73df',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
    });
  }

  restockItem() {
    this.router.navigate(['/admin/products']);
  }
}
