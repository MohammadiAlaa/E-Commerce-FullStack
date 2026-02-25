import { Routes } from '@angular/router';
import { AllProducts } from './core/features/products/components/all-products/all-products';
import { Login } from './core/features/auth/login/login';
import { Register } from './core/features/auth/register/register';
import { OrderDetails } from './core/features/orders/order-details/order-details';
import { AdminUsers } from './core/features/admin/componants/admin-users/admin-users';
import { AdminOrders } from './core/features/admin/componants/admin-orders/admin-orders';
import { AdminDashboard } from './core/features/admin/componants/admin-dashboard/admin-dashboard';
import { AdminLayout } from './core/features/admin/componants/admin-layout/admin-layout';
import { MyOrders } from './core/features/orders/my-orders/my-orders';
import { adminGuard } from './core/guards/admin.guard-guard';
import { authGuard } from './core/guards/auth.guard-guard';
import { DriverOrders } from './core/features/drivers/driver-orders/driver-orders';
import { Checkout } from './core/features/checkout/checkout';
import { ForgotPassword } from './core/features/auth/forgot-password/forgot-password';
import { guestGuardGuard } from './core/guards/guest.guard-guard';
import { CartComponent } from './core/features/cart/cart/cart';
import { ProductDetails } from './core/features/products/components/product-details/product-details';
import { AdminProducts } from './core/features/admin/componants/admin-products/admin-products';
import { AdminCategories } from './core/features/admin/componants/admin-categories/admin-categories';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'products', component: AllProducts, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [guestGuardGuard] },
  { path: 'register', component: Register, canActivate: [guestGuardGuard] },
  { path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuardGuard] },
  { path: 'register', component: Register },
  { path: 'carts', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'my-orders', component: MyOrders, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetails, canActivate: [authGuard] },
  { path: 'details/:id', component: ProductDetails, canActivate: [authGuard] },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'orders', component: AdminOrders },
      { path: 'products', component: AdminProducts },
      { path: 'categories', component: AdminCategories },
      { path: 'driver-tasks', component: DriverOrders },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'products' },
  {
    path: 'driver',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [{ path: 'tasks', component: DriverOrders }],
  },
];
