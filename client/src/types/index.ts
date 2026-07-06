export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  isBlocked?: boolean;
  createdAt?: string;
  token?: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercentage: number;
  discountPrice: number;
  category: Category;
  brand: string;
  images: string[];
  stock: number;
  ratings: number;
  numReviews: number;
  specifications: Specification[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: { _id: string; name: string; email: string } | string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'card' | 'cod' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  notes?: string;
  statusHistory: StatusHistory[];
  createdAt: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  pages?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  ordersByStatus: { _id: string; count: number }[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  page?: number;
}
