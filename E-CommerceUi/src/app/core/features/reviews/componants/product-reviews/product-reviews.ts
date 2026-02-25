import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CreateReviewDto, Review } from '../../../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  @Input() itemId!: number;
  reviews: Review[] = [];
  editingReviewId: number | null = null;
  currentUserId: string | null = null;

  newReview: CreateReviewDto = { itemId: 0, comment: '', rating: 5 };

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.newReview.itemId = this.itemId;
    this.loadReviews();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    }
  }

  loadReviews() {
    this.reviewService.getItemReviews(this.itemId).subscribe({
      next: (res) => (this.reviews = res),
      error: (err) => console.error('Error', err),
    });
  }

  submitReview() {
    if (!this.newReview.comment) return;

    const request = this.editingReviewId
      ? this.reviewService.updateReview(this.editingReviewId, this.newReview)
      : this.reviewService.addReview(this.newReview);

    request.subscribe({
      next: () => {
        Swal.fire('Success', this.editingReviewId ? 'Updated!' : 'Shared!', 'success');
        this.cancelEdit();
        this.loadReviews();
      },
      error: (err) => Swal.fire('Oops!', err.error?.message || 'Action failed', 'error'),
    });
  }

  deleteReview(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReview(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your review has been removed.', 'success');
            this.loadReviews();
          },
        });
      }
    });
  }

  editReview(review: Review) {
    this.editingReviewId = review.id!;
    this.newReview = { itemId: this.itemId, comment: review.comment, rating: review.rating };
    document.querySelector('.add-review-card')?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.newReview = { itemId: this.itemId, comment: '', rating: 5 };
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
