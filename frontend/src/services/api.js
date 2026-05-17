import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://team-task-manager-production-7eb0.up.railway.app/api',
});

// Request Interceptor: Attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred';

    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;