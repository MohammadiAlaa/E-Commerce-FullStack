export interface OrderResponse {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shipping: {
    address: string;
    city: string;
    receiverPhoneNumber: string;
  };
  items: OrderItemResponse[];
  payment: {
    method: string;
    status: string;
    amount: number;
  };
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface UserOrder {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
  cancelReason?: string;
  items: any[];
}
