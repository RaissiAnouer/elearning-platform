import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../api/courses';
import { Course } from '../types/course';
import { 
  BookOpenIcon, 
  VideoCameraIcon, 
  DocumentIcon,
  ClockIcon,
  UserGroupIcon as UsersIcon,
  StarIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import VideoUploadModal from '../components/VideoUploadModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import CourseDocumentList from '../components/courses/CourseDocumentList';
import CourseVideoList from '../components/courses/CourseVideoList';

type TabType = 'description' | 'videos' | 'documents';

type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
};

interface CourseResponse {
  data: Course;
}

interface Document {
  _id: string;
  title: string;
  url: string;
  type: string;
  size: string;
  createdAt: string;
  category?: string;
  description?: string;
}

const getBannerGradient = (courseId: string) => {
  if (courseId.includes('python')) {
    return 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'; // Python theme
  }
  if (courseId.includes('html') || courseId.includes('css')) {
    return 'bg-gradient-to-br from-orange-500 via-pink-600 to-rose-700'; // HTML/CSS theme
  }
  return 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800'; // Default theme
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [refreshDocuments, setRefreshDocuments] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('Course ID is required');
      }

      console.log('Fetching course details for:', id);
      const response = await coursesAPI.getCourse(id);
      
      if (!response || !response.data) {
        throw new Error('Course data not found');
      }
      
      console.log('Received course data:', response.data);
      setCourse(response.data);
    } catch (error: any) {
      console.error('Error fetching course:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to load course details'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnrollment = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour vous inscrire à ce cours');
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      await coursesAPI.enrollInCourse(id!);
      toast.success(`Inscription réussie au cours ${course?.title}`);
      navigate(`/courses/${id}/learn`);
    } catch (error) {
      toast.error("Échec de l'inscription au cours. Veuillez réessayer.");
    }
  };

  const handleVideoUpload = async (videoData: { title: string; file: File }) => {
    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('title', videoData.title);
      formData.append('video', videoData.file);
      formData.append('courseId', id!);

      const response = await coursesAPI.uploadVideo(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      toast.success('Video uploaded successfully');
      setIsVideoModalOpen(false);
      fetchCourse(); // Refresh course data
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video');
      setUploadProgress(0);
    }
  };

  const handleDocumentUpload = async (documentData: { title: string; file: File }) => {
    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('title', documentData.title);
      formData.append('document', documentData.file);
      formData.append('courseId', id!);

      await coursesAPI.uploadDocument(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      await fetchCourse();
      
      setIsDocumentModalOpen(false);
      setUploadProgress(0);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Error uploading document');
      setUploadProgress(0);
    }
  };

  const handleDocumentDeleted = () => {
    setRefreshDocuments(prev => !prev);
  };

  const handleVideoDeleted = () => {
    // Refresh the course data or update the state
    fetchCourse(); // Re-fetch the course data to update the video list
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cours introuvable</h2>
          <p className="text-gray-600 mb-4">Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Introduction', icon: BookOpenIcon },
    { id: 'videos', label: 'Vidéos', icon: VideoCameraIcon },
    { id: 'documents', label: 'Documents', icon: DocumentIcon },
  ];

  const renderTabContent = () => {
    const commonClasses = "animate-fadeIn";
    
    switch (activeTab) {
      case 'description':
        return (
          <div className={`${commonClasses} space-y-6`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction au Cours</h2>
            
            {/* Aperçu du Cours */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Aperçu du Cours</h3>
              <p className="text-gray-600 leading-relaxed">
                {course?.title?.toLowerCase().includes('html') || course?.title?.toLowerCase().includes('css') ? (
                  // Description pour le cours HTML & CSS
                  "Maîtrisez les bases du développement web avec HTML et CSS. Créez des sites web modernes, responsifs et professionnels. Un parcours complet pour devenir développeur web."
                ) : course?.title?.toLowerCase().includes('python') ? (
                  // Description pour le cours Python
                  "Découvrez les fondamentaux de Python, le langage de programmation le plus populaire. " +
                  "Maîtrisez la syntaxe de base, les structures de données et les concepts essentiels " +
                  "de la programmation. Un parcours complet pour débuter en programmation."
                ) : (
                  // Description par défaut
                  course?.description || "Description du cours non disponible."
                )}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-gray-600">
                Bienvenue dans ce cours complet sur {course?.title}. Ce programme a été 
                soigneusement conçu pour vous accompagner dans votre apprentissage, que vous 
                soyez débutant ou que vous souhaitiez approfondir vos connaissances.
              </p>
              
              <p className="text-gray-600">
                Au cours de cette formation, vous aurez l'occasion de :
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                {course?.title?.toLowerCase().includes('html') || course?.title?.toLowerCase().includes('css') ? (
                  // Points clés pour HTML & CSS
                  <>
                    <li>Comprendre les principes fondamentaux du HTML et du CSS</li>
                    <li>Créer des layouts responsive avec Flexbox et Grid</li>
                    <li>Maîtriser les sélecteurs CSS et les bonnes pratiques de style</li>
                    <li>Développer des interfaces modernes et professionnelles</li>
                  </>
                ) : course?.title?.toLowerCase().includes('python') ? (
                  // Points clés pour Python
                  <>
                    <li>Maîtriser les concepts fondamentaux de manière progressive et structurée</li>
                    <li>Mettre en pratique vos connaissances à travers des exercices concrets</li>
                    <li>Bénéficier d'un support pédagogique complet avec {course?.videos?.length} vidéos 
                        et {course?.documents?.length} ressources téléchargeables</li>
                    <li>Développer des compétences pratiques immédiatement applicables</li>
                  </>
                ) : (
                  // Points clés par défaut
                  <li>Contenu personnalisé selon le cours sélectionné</li>
                )}
              </ul>
            </div>
          </div>
        );
      case 'videos':
        return (
          <div className={`${commonClasses} space-y-6`}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <VideoCameraIcon className="h-7 w-7 text-blue-600 mr-3" />
                Vidéos du Cours
              </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {course?.videos?.length || 0} vidéos disponibles
                </p>
              </div>
              {user?.role === 'teacher' && (
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                    text-white rounded-xl hover:from-blue-700 hover:to-blue-800 
                    flex items-center space-x-3 transition-all duration-300 
                    transform hover:scale-105 hover:shadow-lg shadow-blue-200"
                >
                  <VideoCameraIcon className="h-5 w-5" />
                  <span className="font-medium">Ajouter une vidéo</span>
                </button>
              )}
            </div>

            {/* Videos List */}
            {course?.videos?.length ? (
              <div className="grid gap-6">
                <CourseVideoList
                  courseId={course.id}
                  videos={course.videos}
                  onVideoDeleted={handleVideoDeleted}
                  setIsVideoModalOpen={setIsVideoModalOpen}
                />
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white 
                rounded-xl border-2 border-dashed border-gray-200">
                <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-blue-50 
                  flex items-center justify-center">
                  <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  Aucun contenu vidéo disponible
                </p>
              </div>
            )}
          </div>
        );
      case 'documents':
        return (
          <div className={`${commonClasses} space-y-6`}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <DocumentIcon className="h-7 w-7 text-blue-600 mr-3" />
                  Documents du Cours
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {course?.documents?.length || 0} documents disponibles
                </p>
              </div>
              {user?.role === 'teacher' && (
                <button
                  onClick={() => setIsDocumentModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                    text-white rounded-xl hover:from-blue-700 hover:to-blue-800 
                    flex items-center space-x-3 transition-all duration-300 
                    transform hover:scale-105 hover:shadow-lg shadow-blue-200"
                >
                  <DocumentIcon className="h-5 w-5" />
                  <span className="font-medium">Ajouter un document</span>
                </button>
              )}
            </div>

            {/* Documents List */}
            {course?.documents?.length ? (
              <div className="grid gap-6">
                <CourseDocumentList
                  courseId={course.id}
                  documents={course.documents}
                  onDocumentDeleted={handleDocumentDeleted}
                />
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white 
                rounded-xl border-2 border-dashed border-gray-200">
                <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-blue-50 
                  flex items-center justify-center">
                  <DocumentIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  Aucun document disponible
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Banner */}
      <div className={`relative h-[400px] overflow-hidden ${getBannerGradient(course?.id || '')}`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <div className="text-white space-y-4">
            <div className="flex items-center space-x-4">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 
                shadow-lg shadow-black/5">
                {course?.duration} heures de formation
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {course?.title?.toLowerCase().includes('python') 
                ? "Python pour Débutants : De Zéro à Héros"
                : course?.title?.toLowerCase().includes('html') || course?.title?.toLowerCase().includes('css')
                  ? "HTML & CSS : Les Fondamentaux du Web"
                  : course?.title}
            </h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-relaxed drop-shadow">
              {course?.title?.toLowerCase().includes('python')
                ? "Découvrez les fondamentaux de Python, le langage de programmation le plus populaire. " +
                  "Maîtrisez la syntaxe de base, les structures de données et les concepts essentiels " +
                  "de la programmation. Un parcours complet pour débuter en programmation."
                : course?.title?.toLowerCase().includes('html') || course?.title?.toLowerCase().includes('css')
                  ? "Maîtrisez les bases du développement web avec HTML et CSS. Créez des sites web modernes, " +
                    "responsifs et professionnels. Un parcours complet pour devenir développeur web."
                  : course?.description}
            </p>
            <div className="flex items-center space-x-4 text-sm pt-2">
              <div className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 
                shadow-lg shadow-black/5">
                <UsersIcon className="h-5 w-5 mr-2 text-white/80" />
                <span className="text-sm font-medium text-white">
                  {course?.instructor?.includes('Dr.') 
                    ? `Formateur: ${course.instructor.replace('Dr.', 'Dr')}`
                    : `Formateur: ${course?.instructor}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Course Navigation */}
              <nav className="border-b border-gray-200 bg-gray-50/50">
                <div className="flex space-x-4 border-b border-gray-300">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-2 px-4 ${activeTab === 'description' ? 'border-b-2 border-blue-600' : ''}`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`py-2 px-4 ${activeTab === 'videos' ? 'border-b-2 border-blue-600' : ''}`}
                  >
                    Videos
                  </button>
                    <button
                    onClick={() => setActiveTab('documents')}
                    className={`py-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-600' : ''}`}
                  >
                    Documents
                    </button>
                </div>
              </nav>

              {/* Tab Content */}
              <div className="p-6">
                <div className="animate-slideIn">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-96">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="text-4xl font-bold text-gray-900 mb-4">
                    {course?.price?.toFixed(2)} DT
                  </div>
                  <button
                    onClick={handleEnrollment}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg
                      hover:bg-primary-700 transition-all duration-300
                      transform hover:translate-y-[-2px] active:translate-y-[0px]
                      flex items-center justify-center space-x-2 mb-4"
                  >
                    <span className="font-medium">
                      {user ? "S'inscrire au cours" : 'Connectez-vous pour vous inscrire'}
                    </span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Garantie de remboursement sous 30 jours
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Ce cours inclut:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-600">
                        <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
                        {course?.videos?.length || 0} cours en vidéo
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                        {course?.documents?.length || 0} ressources téléchargeables
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                        Accès illimité
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-3" />
                        Accès sur tous les appareils
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                        Certificat de réussite
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VideoUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onUpload={handleVideoUpload}
      />
      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
};

export default CourseDetail;