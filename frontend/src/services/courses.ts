import { api } from '../utils/client';

export const getCourse = async (id: string) => {
  try {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}; 