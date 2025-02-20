import client from './client';
import axios from 'axios';
import { axiosInstance } from './client';
import { Course } from '../types/course';
import { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const coursesAPI = {
  getAllCourses: async () => {
    try {
      const response = await client.get('/courses');
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      throw error;
    }
  },

  getCourseById: async (id: string) => {
    try {
      const response = await client.get(`/courses/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      throw error;
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
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create course');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    const response = await client.delete(`/courses/${id}`);
    return response.data;
  },

  enrollInCourse: async (courseId: string) => {
    const response = await fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to enroll in course');
    }
    
    return response.json();
  },

  getCourse: async (id: string): Promise<AxiosResponse<Course>> => {
    return axiosInstance.get(`/courses/${id}`);
  },
}; 