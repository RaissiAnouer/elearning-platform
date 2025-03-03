import React, { useState } from 'react';
import Button from './shared/Button';
import { authAPI } from '../api/auth'; // Import the API functions
import { useAuth } from '../contexts/AuthContext'; // Import the Auth context

const AddCourseForm = ({ onCourseAdded }) => {
  const { user } = useAuth(); // Get the user from Auth context
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    thumbnail: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCourseData({ ...courseData, thumbnail: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const formData = new FormData();
      Object.keys(courseData).forEach(key => {
        formData.append(key, courseData[key]);
      });

      const response = await authAPI.createCourse(formData, user?.token); // Pass the token
      if (response && response.course) {
        onCourseAdded(response.course); // Pass the new course data to the parent
        // Reset form
        setCourseData({
          title: '',
          description: '',
          duration: '',
          price: '',
          thumbnail: null,
        });
      } else {
        console.error('Failed to add course:', response);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={courseData.title}
          onChange={handleInputChange}
          required
          className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={courseData.description}
          onChange={handleInputChange}
          required
          className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Duration</label>
        <input
          type="text"
          name="duration"
          value={courseData.duration}
          onChange={handleInputChange}
          required
          className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={courseData.price}
          onChange={handleInputChange}
          required
          className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Button type="submit" className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200">Add Course</Button>
    </form>
  );
};

export default AddCourseForm; 