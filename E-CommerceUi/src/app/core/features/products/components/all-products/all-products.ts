import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Productc } from '../productc/productc';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Spinner } from '../../../../../shared/components/spinner/spinner';
import { Select } from '../../../../../shared/components/select/select';
import { Category, Item } from '../../../../models/item.model';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, Select, Productc, Spinner],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProducts implements OnInit {
  products: Item[] = [];
  categories: Category[] = [];
  loading: boolean = false;
  dynamicTitle: string = 'Categories';

  constructor(
    private service: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();
  }

  fetchCategories() {
    this.service.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching categories', err),
    });
  }

  fetchProducts(categoryId?: any) {
    this.loading = true;
    const id = categoryId === 'all' || !categoryId ? undefined : +categoryId;

    this.service.getProducts(id).subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Could not load products', 'error');
      },
    });
  }

  filterCategory(categoryId: any) {
    if (categoryId === 'all') {
      this.dynamicTitle = 'All Categories';
    } else {
      const selected = this.categories.find((cat) => cat.id == categoryId);
      this.dynamicTitle = selected ? selected.name : 'Categories';
    }

    this.fetchProducts(categoryId);
  }

  addtoCart(event: any) {
    this.cartService.addToCart(event.id, event.quantity).subscribe({
      next: () => {
        this.showSuccessAlert();
        this.cdr.detectChanges();
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to add item', 'error');
      },
    });
  }

  private showSuccessAlert() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Added to cart successfully',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
    });
  }

  goToDetails(id: any) {
    this.router.navigate(['/details', id]);
  }
}
