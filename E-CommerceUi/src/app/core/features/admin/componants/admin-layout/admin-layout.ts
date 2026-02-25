import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  isSidebarCollapsed = false;
  isAdmin = false;
  isDriver = false;
  userFullName = 'User';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        const roles = decoded[roleKey];

        this.isAdmin = Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';
        this.isDriver = Array.isArray(roles) ? roles.includes('Driver') : roles === 'Driver';

        this.userFullName =
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';
      } catch (e) {
        this.logout();
      }
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
