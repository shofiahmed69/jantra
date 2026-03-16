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
    const token = typeof window !== 'undefined' ? localStorage.getItem('jontro_admin_token') : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
