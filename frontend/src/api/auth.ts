import client from './client';

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
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
      const response = await client.post('/auth/signup', userData);
      
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
      const response = await client.post('/auth/verify', { token });
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
      
      const response = await client.put('/auth/profile', userData);
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

  createCourse: async (courseData: {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    level: string;
    price: number;
    image: string;
    instructor: string;
  }) => {
    try {
      const response = await client.post('/courses', courseData);
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