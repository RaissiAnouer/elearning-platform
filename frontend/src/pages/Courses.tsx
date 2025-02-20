import React, { useState, useMemo, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  BookOpenIcon,
  ClockIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import CourseCard from '../components/courses/CourseCard';
import CourseFilter from '../components/courses/CourseFilter';
import PageBanner from '../components/shared/PageBanner';
import { coursesAPI } from '../api/courses';
import { Course } from '../types/course';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Modal from '../components/shared/Modal';

const sampleCourses = [
  {
    id: "python-for-beginners",
    title: "Python pour Débutants : De Zéro à Héros",
    instructor: "Dr. Ahmed Ben Ali",
    duration: 20,
    rating: 4.8,
    enrolledCount: 2500,
    image: "/images/courses/banners/python-basics.png",
    price: 299.99,
    description: "Découvrez les fondamentaux de Python, le langage de programmation le plus populaire. Maîtrisez la syntaxe de base, les structures de données et les concepts essentiels de la programmation.",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced" | "All Levels",
    students: 2500,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "html-css-fundamentals",
    title: "HTML & CSS : Les Fondamentaux du Web",
    instructor: "Dr. Sarah Mansour",
    duration: 25,
    rating: 4.9,
    enrolledCount: 1800,
    image: "/images/courses/banners/html-css.jpg",
    price: 399.99,
    description: "Maîtrisez les bases du développement web avec HTML et CSS. Créez des sites web modernes, responsifs et professionnels. Un parcours complet pour devenir développeur web.",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced" | "All Levels",
    students: 1800,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const stats = [
  { name: 'Cours Disponibles', value: '100+', icon: BookOpenIcon },
  { name: 'Heures de Contenu', value: '1000+', icon: ClockIcon },
  { name: 'Étudiants Inscrits', value: '25,000+', icon: UsersIcon },
  { name: 'Instructeurs Experts', value: '50+', icon: AcademicCapIcon },
];

// Add this interface for the simplified course creation
interface NewCourseData {
  title: string;
  description: string;
  price: number;
  duration: number;
  image: File | null;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCourses(sampleCourses);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        console.log('Server health check:', data);
      } catch (error) {
        console.error('Server connection error:', error);
      }
    };

    testConnection();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
      
      return matchesSearch && matchesPrice;
    });
  }, [searchTerm, courses, priceRange]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const handleAddCourse = () => {
    if (!isTeacher) {
      toast.error("Vous n'avez pas l'autorisation d'ajouter des cours");
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreateCourse = (courseData: NewCourseData) => {
    // Handle course creation here
    console.log('Creating course:', courseData);
    setShowCreateModal(false);
    // Add API call to create course
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        title="Nos"
        subtitle="Explorez notre sélection de cours pour développer vos compétences"
        highlight="cours"
        tag="Apprenez avec nous"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with fixed filter */}
          <div className="w-full lg:w-[280px] lg:flex-shrink-0">
            <div className="sticky top-24">
              <CourseFilter
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                onReset={handleReset}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Add Teacher Controls */}
            {isTeacher && (
              <div className="mb-6">
                <button
                  onClick={handleAddCourse}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Ajouter un Nouveau Cours
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl shadow-sm 
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300
                    group-hover:border-primary-400"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchTerm ? `Cours "${searchTerm}"` : 'Tous les cours'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredCourses.length} cours disponibles
                </p>
              </div>
            </div>

            {/* Course Grid */}
            {currentCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <BookOpenIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun cours trouvé
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Essayez d'ajuster vos filtres ou votre recherche pour trouver les cours qui vous intéressent.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                            transition-all duration-300 transform hover:translate-y-[-2px]"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                {currentCourses.map(course => (
                  <div key={course.id} className="transform hover:translate-y-[-4px] transition-all duration-300">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add the CreateCourseModal */}
      <CreateCourseModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCourse}
      />
    </div>
  );
};

// Add this modal component for course creation
const CreateCourseModal = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewCourseData) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<NewCourseData>({
    title: '',
    description: '',
    price: 0,
    duration: 1,
    image: null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCourseData({
        title: '',
        description: '',
        price: 0,
        duration: 1,
        image: null
      });
      setPreviewImage(null);
    }
  }, [isOpen]);

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!courseData.title.trim() || !courseData.description.trim()) {
          toast.error('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
      case 2:
        if (!courseData.duration || !courseData.price) {
          toast.error('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
      case 3:
        if (!courseData.image) {
          toast.error("Veuillez ajouter une image de couverture");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(courseData);
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCourseData(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = [
    { number: 1, title: "Informations de Base" },
    { number: 2, title: "Prix & Durée" },
    { number: 3, title: "Image du Cours" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du Cours <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={courseData.title}
                onChange={e => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                placeholder="ex: Python pour Débutants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={courseData.description}
                onChange={e => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                rows={4}
                placeholder="Décrivez votre cours en quelques phrases..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (heures) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  value={courseData.duration}
                  onChange={e => setCourseData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="ex: 20"
                />
                <span className="absolute right-3 top-2 text-gray-500">heures</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (DT) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={courseData.price}
                  onChange={e => setCourseData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  placeholder="ex: 299.99"
                />
                <span className="absolute left-3 top-2 text-gray-500">DT</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image de Couverture <span className="text-red-500">*</span>
              </label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg 
                  hover:border-primary-500 transition-colors duration-200"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    setCourseData(prev => ({ ...prev, image: file }));
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    toast.error('Veuillez déposer une image valide');
                  }
                }}
              >
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-48 w-auto rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setCourseData(prev => ({ ...prev, image: null }));
                          }}
                          className="text-white hover:text-red-500 transition-colors duration-200 
                            bg-black bg-opacity-50 rounded-full p-2"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 
                            hover:text-primary-500 focus-within:outline-none"
                        >
                          <span>Télécharger une image</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 10 * 1024 * 1024) {
                                  toast.error('L\'image ne doit pas dépasser 10MB');
                                  return;
                                }
                                setCourseData(prev => ({ ...prev, image: file }));
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPreviewImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">ou glissez et déposez</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        {/* Progress Steps - Updated styling */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg shadow-md transition-all duration-300 transform hover:scale-110 ${
                      step.number < currentStep
                        ? 'bg-green-500 text-white'
                        : step.number === currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="text-sm mt-2 font-medium text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      step.number < currentStep 
                        ? 'bg-green-500' 
                        : step.number === currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Updated Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              className={`px-6 py-2.5 flex items-center space-x-2 text-gray-700 bg-gray-100 rounded-lg 
                hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Précédent</span>
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 flex items-center space-x-2 text-white bg-gradient-to-r from-blue-600 to-blue-700
                  rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
              >
                <span>Suivant</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 flex items-center space-x-2 text-white bg-gradient-to-r from-green-500 to-green-600
                  rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg"
              >
                <span>Créer le Cours</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Courses;