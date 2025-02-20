import axios from 'axios';
import { toast } from 'react-hot-toast';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
client.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request headers:', config.headers);
    console.log('Request data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
client.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });

    // Don't automatically logout on 401
    if (error.response?.status === 401) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        window.location.href = '/login';
      }
    }

    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default client; 