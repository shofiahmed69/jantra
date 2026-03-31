import axios from 'axios';

const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL;

    if (!url) {
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            url = 'https://jontro-backend.onrender.com';
        } else {
            url = 'http://localhost:4000';
        }
    }

    // Ensure /api suffix
    return url.endsWith('/api') ? url : `${url}/api`;
};

const API_BASE_URL = getBaseUrl();

console.log(`[API] Base URL: ${API_BASE_URL}`);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token =
            localStorage.getItem('token') ||
            localStorage.getItem('adminToken');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401/403
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403 ||
            error.response?.status === 401) {
            if (typeof window !== 'undefined' &&
                !window.location.pathname.includes('/admin/login')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

