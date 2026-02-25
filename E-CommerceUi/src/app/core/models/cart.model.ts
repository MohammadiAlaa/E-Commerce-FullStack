export interface CartItem {
  id: number;
  itemId: number;
  quantity: number;
  item: CartProduct;
}

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  description?: string;
}
