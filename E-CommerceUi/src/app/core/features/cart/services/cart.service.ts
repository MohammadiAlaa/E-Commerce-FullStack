import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://localhost:7247/api/Cart';

  private cartCounter = new BehaviorSubject<number>(0);
  cartCounter$ = this.cartCounter.asObservable();

  constructor(private http: HttpClient) {
    this.updateCartCount();
  }

  getCart(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((Items) => {
        this.calculateAndSetCount(Items);
      }),
    );
  }

  addToCart(itemId: number, quantity: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/Add`, { itemId, quantity })
      .pipe(tap(() => this.updateCartCount()));
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add`, { itemId, quantity }).pipe(
      tap(() => this.getCart().subscribe()), 
    );
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/Remove/${itemId}`)
      .pipe(tap(() => this.updateCartCount()));
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Clear`).pipe(
      tap(() => {
        this.cartCounter.next(0);
      }),
    );
  }

  updateCartCount() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (items) => this.calculateAndSetCount(items),
      error: () => this.cartCounter.next(0),
    });
  }

  private calculateAndSetCount(items: any[]) {
    const count = items.reduce((acc, curr) => acc + curr.quantity, 0);
    this.cartCounter.next(count);
  }
}
