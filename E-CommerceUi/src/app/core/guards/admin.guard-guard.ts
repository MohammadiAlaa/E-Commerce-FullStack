import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const roles = decodedToken[roleKey];

      const hasPermission = Array.isArray(roles)
        ? (roles.includes('Admin') || roles.includes('Driver'))
        : (roles === 'Admin' || roles === 'Driver');

      if (hasPermission) {
        return true;
      }
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }

  router.navigate(['/products']);
  return false;
};
