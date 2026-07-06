import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const updated = await cartService.addToCart(productId, quantity);
      setCart(updated);
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  }, [user]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      const updated = await cartService.updateCartItem(itemId, quantity);
      setCart(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  }, []);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      const updated = await cartService.removeFromCart(itemId);
      setCart(updated);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCart(null);
    } catch {
      toast.error('Failed to clear cart');
    }
  }, []);

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
