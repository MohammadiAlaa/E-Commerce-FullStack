import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  productForm: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;
  currentProductId: number | null = null;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image: [null],
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe({
      next: (res: any) => {
        this.products = [...res];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  loadCategories() {
    this.adminService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res;
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  openAddModal() {
    this.isEditMode = false;
    this.productForm.reset();
    this.selectedFile = null;
  }

  openEditModal(product: any) {
    this.isEditMode = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
    });
  }

  saveProduct() {
    const formData = new FormData();
    Object.keys(this.productForm.value).forEach((key) => {
      if (key !== 'image') formData.append(key, this.productForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    if (this.isEditMode && this.currentProductId) {
      this.adminService.updateProduct(this.currentProductId, formData).subscribe({
        next: () => this.handleSuccess('Updated!'),
        error: () => Swal.fire('Error', 'Update failed', 'error'),
      });
    } else {
      this.adminService.addProduct(formData).subscribe({
        next: () => this.handleSuccess('Saved!'),
        error: () => Swal.fire('Error', 'Save failed', 'error'),
      });
    }
  }

  deleteItem(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteProduct(id).subscribe({
          next: () => {
            this.handleSuccess('Deleted!');
          },
          error: (err) => Swal.fire('Error', 'Delete failed', 'error'),
        });
      }
    });
  }

  private handleSuccess(msg: string) {
    Swal.fire('Success', msg, 'success');
    this.loadProducts();
    document.getElementById('closeModal')?.click();
    this.cdr.detectChanges();
  }
}
