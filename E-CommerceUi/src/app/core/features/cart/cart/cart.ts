import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit {
  cartProducts: any[] = [];
  total: number = 0;
  loading: boolean = false;
  readonly FREE_SHIPPING_LIMIT = 300;
  readonly SHIPPING_FEE = 30;

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData() {
    this.cartService.getCart().subscribe((res) => {
      this.cartProducts = res;
      this.calculateTotal();
      this.cdr.detectChanges();
    });
  }

  plusQuantity(itemId: number) {
    this.cartService.updateQuantity(itemId, 1).subscribe(() => {
      this.getCartData();
    });
  }

  minusQuantity(itemId: number, currentQty: number) {
    if (currentQty > 1) {
      this.cartService.updateQuantity(itemId, -1).subscribe(() => {
        this.getCartData();
      });
    } else {
      this.deleteProduct(itemId);
    }
  }

  calculateTotal() {
    this.total = 0;
    this.cartProducts.forEach((item) => {
      const price = item.item.discountPrice || item.item.price;
      this.total += price * item.quantity;
    });
  }

  deleteProduct(itemId: number) {
    this.cartService.removeFromCart(itemId).subscribe(() => {
      this.getCartData();
    });
  }

  clearAll() {
    this.cartService.clearCart().subscribe(() => {
      this.cartProducts = [];
      this.total = 0;
    });
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
