import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CodeBracketIcon,
  CommandLineIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import Card from '../shared/Card';
import { Course } from '../../types/course';
import CourseAccessModal from './CourseAccessModal';

// Update the DEFAULT_COURSE_IMAGES
const DEFAULT_COURSE_IMAGES = {
  python: "/images/courses/banners/python-basics.png",
  html: "/images/courses/banners/html-css.jpg",
  default: "/images/courses/banners/default-course.jpg" // Add a default banner
};

interface CourseCardProps {
  course: Course;
  imageUrl?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, imageUrl }) => {
  const { user } = useAuth();
  const [showAccessModal, setShowAccessModal] = useState(false);
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);

  const getCourseBanner = (courseId: string) => {
    if (courseId.includes('python')) return DEFAULT_COURSE_IMAGES.python;
    if (courseId.includes('html') || courseId.includes('css')) return DEFAULT_COURSE_IMAGES.html;
    return DEFAULT_COURSE_IMAGES.default;
  };

  const bannerImage = imageUrl || course.image || getCourseBanner(course.id);

  const levelTranslations = {
    'Beginner': 'Débutant',
    'Intermediate': 'Intermédiaire',
    'Advanced': 'Avancé',
    'All Levels': 'Tous Niveaux'
  };

  const handleCourseClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowAccessModal(true);
      return;
    }
    const courseId = course.id;
    navigate(`/courses/${courseId}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const courseId = course.id;
    console.log('Navigating to course ID:', courseId);
    navigate(`/courses/${courseId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCourseClick(e as React.MouseEvent);
    }
  };

  return (
    <>
      <div className="course-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <img src={bannerImage} alt={course.title} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="p-4">
          <div role="button" tabIndex={0} onKeyPress={handleKeyPress} onClick={handleCourseClick}>
            <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
          </div>
          <p className="text-gray-600">{course.description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{course.duration} hours</span>
            <span className="text-lg font-semibold text-blue-600">{course.price} DT</span>
          </div>
          <Link to={`/courses/${course.id}`} className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">View Details</Link>
        </div>
      </div>

      <CourseAccessModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        courseTitle={course.title}
      />
    </>
  );
};

export default CourseCard; 