import axios from 'axios';

export const authAPI = {
  createCourse: async (formData, token) => {
    const response = await axios.post('/api/courses/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Include the token in the headers
      },
    });
    return response.data; // Ensure this returns the course data
  },
}; 