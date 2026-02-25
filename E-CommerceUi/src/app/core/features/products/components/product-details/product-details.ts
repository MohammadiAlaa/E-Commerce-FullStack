import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Spinner } from '../../../../../shared/components/spinner/spinner';
import { ProductReviews } from '../../../reviews/componants/product-reviews/product-reviews';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, Spinner, FormsModule, RouterLink, ProductReviews],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  id!: number; // خليها number
  data: any = {};
  loading: boolean = false;
  amount: number = 1;

  constructor(
    private route: ActivatedRoute,
    private service: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = Number(idParam);
        this.getProduct();
      }
    });
  }

  getProduct() {
    this.loading = true;
    this.service.getProductById(this.id).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Product not found!', 'error');
      },
    });
  }

  addToCart() {
    this.cartService.addToCart(this.data.id, this.amount).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
      },
    });
  }
}
