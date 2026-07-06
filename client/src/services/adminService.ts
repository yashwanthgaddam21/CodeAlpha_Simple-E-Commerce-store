import api from './api';
import { User, Category, AdminStats, ApiResponse } from '../types';

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data.data;
  },

  getUsers: async (page = 1): Promise<ApiResponse<User[]>> => {
    const res = await api.get(`/users?page=${page}`);
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  toggleBlockUser: async (id: string): Promise<{ isBlocked: boolean }> => {
    const res = await api.put(`/users/${id}/block`);
    return res.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data.data;
  },

  createCategory: async (formData: FormData): Promise<Category> => {
    const res = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  updateCategory: async (id: string, formData: FormData): Promise<Category> => {
    const res = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  updateProfile: async (formData: FormData): Promise<User> => {
    const res = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  getReviews: async (productId: string) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  addReview: async (data: { productId: string; rating: number; title: string; comment: string }) => {
    const res = await api.post('/reviews', data);
    return res.data.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};
