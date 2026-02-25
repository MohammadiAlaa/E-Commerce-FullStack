export interface Review {
  id?: number;
  itemId: number;
  userId?: string;
  comment: string;
  rating: number;
  createdAt?: string;
  user?: any;
}

export interface CreateReviewDto {
  itemId: number;
  comment: string;
  rating: number;
}
