import { UserOrder } from "./order.model";

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isBlocked: boolean;
}

export interface Shipping {
  id: number;
  address: string;
  city: string;
  receiverPhoneNumber: string;
  status: string;
  orderId: number;
  lastUpdated?: string;
  driverId?: string;
  driver?: any;
  cancelReason?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  cancelledOrdersCount: number;
  lowStockCount: number;
  lowStockItems: {
    name: string;
    quantity: number;
  }[];
}

export interface TopProduct {
  productName: string;
  totalSold: number;
  totalRevenue: number;
}
