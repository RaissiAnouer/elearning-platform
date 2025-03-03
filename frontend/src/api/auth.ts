import api from './config';
import axios from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response.data); // Debug log
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  signup: async (userData: {
    name?: string;
    email: string;
    password: string;
    username: string;
    phone: string;
    role: string;
    grade?: string;
  }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      // Store token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      
      // Throw a more user-friendly error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      } else {
        throw new Error('Failed to create account. Please try again.');
      }
    }
  },

  verifyToken: async (token: string) => {
    try {
      const response = await api.post('/auth/verify', { token });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      throw error;
    }
  },

  updateProfile: async (userData: {
    name: string;
    email: string;
    phone: string;
    grade?: string;
  }) => {
    try {
      console.log('Making update profile request with data:', userData);
      
      const response = await api.put('/auth/profile', userData);
      console.log('Update profile response:', response.data);

      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error('Invalid server response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.response?.status === 404) {
        throw new Error('Profile update endpoint not found');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update profile');
    }
  },

  createCourse: async (courseData: FormData) => {
    try {
      const response = await api.post('/courses/add', courseData);
      return response.data;
    } catch (error: any) {
      console.error('Course creation error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create course');
    }
  }
}; 