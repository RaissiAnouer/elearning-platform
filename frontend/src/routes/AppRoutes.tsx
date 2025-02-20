import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Orientation from '../pages/Orientation';
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import UserProfile from '../pages/UserProfile';
import AddCourse from '../pages/AddCourse';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/orientation" element={<Orientation />} />
      <Route path="/courses" element={<Courses />} />
      <Route 
        path="/courses/:id" 
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } 
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/add"
        element={
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;