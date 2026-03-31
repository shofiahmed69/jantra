import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    'https://jontro-backend.onrender.com/api';

console.log('[API] Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token =
                localStorage.getItem('token') ||
                localStorage.getItem('adminToken') ||
                localStorage.getItem('auth_token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[API] Token attached:',
                    token.substring(0, 20) + '...');
            } else {
                console.warn('[API] No token found in storage!');
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[API] Error:',
            error.response?.status,
            error.config?.url);

        if (typeof window !== 'undefined') {
            if (error.response?.status === 401 ||
                error.response?.status === 403) {
                console.log('[API] Auth failed, clearing storage');
                localStorage.clear();
                sessionStorage.clear();
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/admin/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
