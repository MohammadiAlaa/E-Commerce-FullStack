import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReviewDto, Review } from '../../../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'https://localhost:7247/api/Reviews';

  constructor(private http: HttpClient) {}

  addReview(reviewDto: CreateReviewDto) {
    return this.http.post(this.apiUrl, reviewDto);
  }

  getItemReviews(itemId: number) {
    return this.http.get<Review[]>(`${this.apiUrl}/Item/${itemId}`);
  }

  deleteReview(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateReview(id: number, reviewDto: CreateReviewDto) {
    return this.http.put(`${this.apiUrl}/${id}`, reviewDto);
  }
}
