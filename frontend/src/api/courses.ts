import client from './client';
import axios from 'axios';
import type { ProgressEvent } from 'axios';
import { Course } from '../types/course';

const API_URL = 'http://localhost:5000/api';

export const coursesAPI = {
  getAllCourses: async () => {
    try {
      console.log('Fetching all courses...');
      const response = await client.get<Course[]>('/courses');
      console.log('Courses fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
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

  getCourse: async (id: string) => {
    try {
      console.log('Fetching course:', id);
      const response = await client.get<Course>(`/courses/${id}`);
      console.log('Course fetched:', response.data);
      return response;
    } catch (error: any) {
      console.error('Error fetching course:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch course details');
    }
  },

  uploadVideo: async (formData: FormData, onProgress?: (progress: number) => void) => {
    try {
      const response = await client.post(
        `/courses/${formData.get('courseId')}/videos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress?.(progress);
            }
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadDocument: async (formData: FormData, onProgress?: (progress: number) => void) => {
    try {
      const response = await client.post(
        `/courses/${formData.get('courseId')}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress?.(progress);
            }
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },
}; 