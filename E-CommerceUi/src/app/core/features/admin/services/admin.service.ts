import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Item } from '../../../models/item.model';
import { DashboardStats, Shipping, TopProduct, User } from '../../../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://localhost:7247/api';

  constructor(private http: HttpClient) {}

  getMyTasks(): Observable<Shipping[]> {
    return this.http.get<Shipping[]>(`${this.apiUrl}/Shippings/MyTasks`);
  }

  // 1. ---------------------- Users ----------------------
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/Accounts/AllUsers`);
  }

  assignRole(userId: string, roleName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Accounts/AddRole`, {
      UserId: userId,
      RoleName: roleName,
    });
  }

  toggleUserBlock(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Accounts/ToggleBlock/${userId}`, {});
  }

  // 2. ------------------------- Shipping -----------------
  getAllShippings(): Observable<Shipping[]> {
    return this.http.get<Shipping[]>(`${this.apiUrl}/Shippings/All`);
  }

  updateShippingStatus(shippingId: number, status: string, reason?: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Shippings/${shippingId}/Status`, {
      status,
      reason,
    });
  }

  // 3. ------------------------- Dashboard ----------------------
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/Dashboard/Stats`);
  }

  getTopSelling(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.apiUrl}/Dashboard/TopSellingProducts`);
  }

  // 4. ------------------------- Items (Products) -------------------
  getProducts(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/Items`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Items/${id}`);
  }

  addProduct(formData: FormData): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/Items`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/Items/${id}`, formData);
  }

  assignDriver(shippingId: number, driverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Shippings/${shippingId}/AssignDriver/${driverId}`, {});
  }

  // 4. ------------------------- Category -------------------

  addCategory(categoryName: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/Categories`, { name: categoryName });
  }

  updateCategory(id: number, categoryName: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/Categories/${id}`, { name: categoryName });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Categories/${id}`);
  }
}
