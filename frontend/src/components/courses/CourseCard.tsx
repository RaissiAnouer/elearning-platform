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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={bannerImage}
            alt={course.title}
            className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 
              ${imageLoading ? 'animate-pulse bg-gray-200' : ''}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== DEFAULT_COURSE_IMAGES.default) {
                target.src = DEFAULT_COURSE_IMAGES.default;
              }
              setImageLoading(false);
            }}
            onLoad={() => setImageLoading(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 group-hover:to-black/70 transition-all duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">{course.duration} heures</span>
              </div>
              <div className="bg-primary-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-white">{course.price} DT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleCourseClick}
              className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 
                       transition-all duration-300 flex items-center justify-center space-x-2 
                       transform hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              <span className="font-medium">{user ? "S'inscrire" : 'Connectez-vous pour vous inscrire'}</span>
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Link 
              to={`/courses/${course.id}`} 
              className="w-full border-2 border-primary-600 text-primary-600 py-2.5 px-4 rounded-lg 
                       hover:bg-primary-50 transition-all duration-300 flex items-center justify-center space-x-2
                       transform hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              <span className="font-medium">Voir les détails</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
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