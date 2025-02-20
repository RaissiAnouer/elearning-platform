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
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import type { AxiosResponse } from 'axios';

type TabType = 'description' | 'videos' | 'documents';

interface CourseResponse {
  data: Course;
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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('Course ID is required');
        }

        console.log('Fetching course with ID:', id);
        const response = await coursesAPI.getCourse(id) as AxiosResponse<Course>;
        
        if (!response || !response.data) {
          throw new Error('Course not found');
        }
        
        console.log('Course data received:', response.data);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError(error instanceof Error ? error.message : 'Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
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
    const commonClasses = "transition-all duration-300 animate-slideIn";
    
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

                    {/* Section Méthodologie */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Notre Méthodologie</h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-600 mb-4">
                          Notre approche pédagogique repose sur trois piliers essentiels :
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h4 className="font-semibold text-primary-600 mb-2">Théorie</h4>
                            <p className="text-sm text-gray-600">Des explications claires et détaillées pour une compréhension approfondie</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h4 className="font-semibold text-primary-600 mb-2">Pratique</h4>
                            <p className="text-sm text-gray-600">Des exercices concrets pour consolider vos apprentissages</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h4 className="font-semibold text-primary-600 mb-2">Accompagnement</h4>
                            <p className="text-sm text-gray-600">Un suivi personnalisé pour optimiser votre progression</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Objectifs d'Apprentissage */}
                    {course?.whatYouWillLearn && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ce Que Vous Allez Apprendre</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                              <div className="flex-shrink-0 mr-3">
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Public Cible */}
                    {course?.targetAudience && (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">À Qui S'adresse Ce Cours</h3>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <ul className="space-y-3">
                            {course.targetAudience.map((audience, index) => (
                              <li key={index} className="flex items-center text-gray-700">
                                <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {audience}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Certification */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Certification</h3>
                      <div className="bg-primary-50 p-6 rounded-lg">
                        <p className="text-gray-700">
                          À la fin de ce cours, vous recevrez un certificat de réussite attestant de vos nouvelles compétences. Ce certificat pourra être partagé sur votre profil professionnel et sur LinkedIn.
                        </p>
                      </div>
                    </div>
                  </div>
        );
      case 'videos':
        return (
          <div className={`${commonClasses} space-y-4`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <VideoCameraIcon className="h-6 w-6 text-primary-600 mr-2" />
              Contenu du Cours
            </h2>
                    {course?.videos?.length ? (
              <div className="grid gap-4">
                {course.videos.map((video, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 
                      transition-all duration-200 hover:shadow-md hover:scale-[1.01] transform"
                  >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full 
                      bg-primary-100 mr-4 transition-all duration-200 group-hover:bg-primary-200">
                            <VideoCameraIcon className="h-5 w-5 text-primary-600" />
                          </div>
                    <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{video.title}</h3>
                            <p className="text-sm text-gray-500">{video.duration}</p>
                          </div>
                    <div className="ml-4">
                      <span className="px-3 py-1 text-xs font-medium text-primary-600 
                        bg-primary-50 rounded-full">
                        Leçon {index + 1}
                      </span>
                        </div>
                  </div>
                ))}
              </div>
                    ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune vidéo disponible pour le moment.</p>
                  </div>
                )}
          </div>
        );
      case 'documents':
        return (
          <div className={`${commonClasses} space-y-4`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <DocumentIcon className="h-6 w-6 text-primary-600 mr-2" />
              Matériel de Cours
            </h2>
                    {course?.documents?.length ? (
              <div className="grid gap-4">
                {course.documents.map((doc, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg 
                      hover:bg-gray-100 transition-all duration-200 
                      hover:shadow-md group"
                  >
                    <div className="flex items-center justify-center h-10 w-10 
                      rounded-full bg-primary-100 mr-4 transition-all duration-200 
                      group-hover:bg-primary-200">
                            <DocumentIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{doc.title}</h3>
                            <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                          </div>
                    <button className="px-4 py-2 text-sm font-medium text-primary-600 
                      hover:text-primary-700 transition-colors duration-200
                      opacity-0 group-hover:opacity-100 transform translate-x-4 
                      group-hover:translate-x-0 transition-all">
                            Télécharger
                          </button>
                        </div>
                ))}
              </div>
                    ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun document disponible pour le moment.</p>
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
                <div className="flex px-2 md:px-6">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`relative py-4 px-6 transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'text-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className={`flex items-center space-x-2 ${
                        activeTab === tab.id ? 'scale-105 transform' : ''
                      } transition-transform duration-200`}>
                        <tab.icon className={`h-5 w-5 transition-colors duration-200 ${
                          activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 
                          transform scale-x-100 transition-transform duration-300" />
                      )}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-transparent ${
                        activeTab === tab.id ? 'bg-primary-100' : ''
                      } transition-colors duration-200`} />
                    </button>
                  ))}
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
    </div>
  );
};

export default CourseDetail; 