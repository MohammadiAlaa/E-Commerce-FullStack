import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Order } from '../orders/services/order';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../cart/services/cart.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  checkoutForm!: FormGroup;
  cartProducts: CartItem[] = [];
  total = 0;
  loading = false;
  readonly FREE_SHIPPING_LIMIT = 300;
  readonly SHIPPING_FEE = 30;

  constructor(
    private fb: FormBuilder,
    private orderService: Order,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCartFromServer();
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      receiverPhoneNumber: [
        '',
        [Validators.required, Validators.pattern('^01[0-2,5]{1}[0-9]{8}$')],
      ],
      paymentMethod: ['Cash', Validators.required], // تم تفعيل الكاش افتراضياً
    });
  }

  loadCartFromServer() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartProducts = data;
        if (!data || data.length === 0) {
          this.router.navigate(['/cart']);
        }
        this.calculateTotal();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/cart']);
      },
    });
  }

  calculateTotal() {
    this.total = this.cartProducts.reduce((acc, cartItem) => {
      if (!cartItem.item) return acc;
      const price =
        cartItem.item.discountPrice && cartItem.item.discountPrice > 0
          ? cartItem.item.discountPrice
          : cartItem.item.price;
      return acc + price * cartItem.quantity;
    }, 0);
  }

  get shippingFee(): number {
    return this.total >= this.FREE_SHIPPING_LIMIT ? 0 : this.SHIPPING_FEE;
  }

  get finalTotal(): number {
    return this.total + this.shippingFee;
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.checkoutForm.getRawValue();

    const orderData = {
      shippingAddress: formValue.address,
      city: formValue.city,
      receiverPhoneNumber: formValue.receiverPhoneNumber,
      paymentMethod: formValue.paymentMethod,
      items: this.cartProducts.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      })),
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.loading = false;
            this.cdr.detectChanges();
            Swal.fire({
              icon: 'success',
              title: 'Order Placed!',
              text: 'Your order has been received successfully.',
              confirmButtonColor: '#198754',
            }).then(() => {
              this.router.navigate(['/my-orders']);
            });
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        Swal.fire(
          'Error',
          err.error?.message || 'Something went wrong, please try again.',
          'error',
        );
      },
    });
  }
}
