import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Item } from '../../../models/item.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'https://localhost:7247/api';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/Categories`);
  }

  getProducts(categoryId?: number): Observable<Item[]> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    return this.http.get<Item[]>(`${this.apiUrl}/Items`, { params });
  }

  getProductById(id: number | string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/Items/${id}`);
  }
}
