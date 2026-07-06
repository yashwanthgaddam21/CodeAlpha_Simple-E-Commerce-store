import api from './api';
import { Order, Address, ApiResponse } from '../types';

export const orderService = {
  placeOrder: async (data: {
    shippingAddress: Address;
    paymentMethod: string;
    notes?: string;
  }): Promise<Order> => {
    const res = await api.post('/orders', data);
    return res.data.data;
  },

  getMyOrders: async (page = 1): Promise<ApiResponse<Order[]>> => {
    const res = await api.get(`/orders/myorders?page=${page}`);
    return res.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const res = await api.put(`/orders/${id}/cancel`, { reason });
    return res.data.data;
  },
};

export const adminOrderService = {
  getAllOrders: async (page = 1, status?: string): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.append('status', status);
    const res = await api.get(`/orders?${params}`);
    return res.data;
  },

  updateOrderStatus: async (id: string, status: string, note?: string): Promise<Order> => {
    const res = await api.put(`/orders/${id}/status`, { status, note });
    return res.data.data;
  },
};
