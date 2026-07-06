import api from './api';
import { Cart } from '../types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get('/cart');
    return res.data.data;
  },

  addToCart: async (productId: string, quantity: number = 1): Promise<Cart> => {
    const res = await api.post('/cart', { productId, quantity });
    return res.data.data;
  },

  updateCartItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    return res.data.data;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
