import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderResponse } from '../../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class Order {
  private apiUrl = 'https://localhost:7247/api/Orders';
  private paymentUrl = 'https://localhost:7247/api/Payments';

  constructor(private http: HttpClient) {}

  createOrder(orderDto: any) {
    return this.http.post(this.apiUrl, orderDto);
  }

  getUserOrders() {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/MyOrders`);
  }

  getOrderById(id: number) {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  cancelOrder(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/Cancel`, {});
  }

  confirmPayment(paymentId: number) {
    return this.http.post(`${this.paymentUrl}/${paymentId}/Confirm`, {});
  }

  completeOrder(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/Complete`, {});
  }
}
