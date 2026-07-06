import api from './api';
import { Product, ProductFilters, ApiResponse } from '../types';

export const productService = {
  getProducts: async (filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('price[gte]', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('price[lte]', String(filters.maxPrice));
    if (filters.rating) params.append('rating', String(filters.rating));
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if ((filters as any).limit) params.append('limit', String((filters as any).limit));
    const res = await api.get(`/products?${params.toString()}`);
    return res.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const res = await api.get('/products/featured');
    return res.data.data;
  },

  getProductBySlug: async (slug: string): Promise<{ product: Product; related: Product[] }> => {
    const res = await api.get(`/products/${slug}`);
    return { product: res.data.data, related: res.data.related };
  },

  getProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/id/${id}`);
    return res.data.data;
  },

  createProduct: async (formData: FormData): Promise<Product> => {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  updateProduct: async (id: string, formData: FormData): Promise<Product> => {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
