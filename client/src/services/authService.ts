import api from './api';
import { User } from '../types';

export const authService = {
  register: async (data: { name: string; email: string; password: string }): Promise<User> => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  login: async (data: { email: string; password: string }): Promise<User> => {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
