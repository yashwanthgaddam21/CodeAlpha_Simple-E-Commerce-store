import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');

  if (user) {
    try {
      const parsedUser = JSON.parse(user);

      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch {
      localStorage.removeItem('user');
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Clear an expired/invalid login, but do not force a browser redirect.
    // React Router's ProtectedRoute will redirect safely to /login.
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);

export default api;