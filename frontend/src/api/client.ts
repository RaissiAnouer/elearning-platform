import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout
  timeout: 10000
});

// Request interceptor
client.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    console.log('Making request to:', config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(new Error('Network error'));
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
      return Promise.reject(new Error('Request timed out'));
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 404:
        toast.error('Resource not found');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(error.response.data.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

export default client; 