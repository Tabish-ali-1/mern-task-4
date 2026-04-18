import axios from 'axios';

// Create an Axios instance with base URL and interceptors
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
