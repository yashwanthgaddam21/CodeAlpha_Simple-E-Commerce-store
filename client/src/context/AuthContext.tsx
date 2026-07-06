import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const userData = await authService.login({ email, password });
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name}!`);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const userData = await authService.register({ name, email, password });
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success(`Welcome to ShopNest, ${userData.name}!`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    // Preserve the token from the stored user
    const stored = localStorage.getItem('user');
    let token = updatedUser.token;
    if (!token && stored) {
      try {
        token = JSON.parse(stored).token;
      } catch {}
    }
    const merged = { ...updatedUser, token };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
