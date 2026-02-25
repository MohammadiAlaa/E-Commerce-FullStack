export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  categoryId: number;
  imageUrl?: string; 
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
}

export interface CreateItemDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  image: File;
}
