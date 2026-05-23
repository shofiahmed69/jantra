import axios from 'axios';

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== 'undefined' ? '' : process.env.BACKEND_URL || 'http://localhost:4000');

export const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('apex_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('apex_token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
