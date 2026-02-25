import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  isEditMode = false;
  currentCategoryId: number | null = null;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.adminService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories', err),
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.categoryForm.reset();
  }

  openEditModal(cat: any) {
    this.isEditMode = true;
    this.currentCategoryId = cat.id;
    this.categoryForm.patchValue({ name: cat.name });
  }

  saveCategory() {
    const name = this.categoryForm.value.name;
    if (this.isEditMode && this.currentCategoryId) {
      this.adminService.updateCategory(this.currentCategoryId, name).subscribe({
        next: () => this.handleSuccess('Category Updated!'),
      });
    } else {
      this.adminService.addCategory(name).subscribe({
        next: () => this.handleSuccess('Category Added!'),
      });
    }
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete if it contains products!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteCategory(id).subscribe({
          next: () => this.handleSuccess('Deleted!'),
          error: (err) => Swal.fire('Error', err.error || 'Delete failed', 'error'),
        });
      }
    });
  }

  private handleSuccess(msg: string) {
    Swal.fire('Success', msg, 'success');
    this.loadCategories();
    document.getElementById('closeCatModal')?.click();
  }
}
