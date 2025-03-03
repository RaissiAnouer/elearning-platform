import React, { useState } from 'react';
import { 
  AcademicCapIcon,
  CalculatorIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import UniversityGuide from '../components/orientation/UniversityGuide';
import ScoreCalculator from '../components/orientation/ScoreCalculator';
import InteractiveTest from '../components/orientation/InteractiveTest';
import PageBanner from '../components/shared/PageBanner';

type ContentType = 'university' | 'calculator' | 'test';

const Orientation = () => {
  const [activeContent, setActiveContent] = useState<ContentType>('university');

  const menuItems = [
    {
      id: 'university',
      name: 'Orientation Universitaire',
      icon: AcademicCapIcon,
      description: 'Découvrez les filières et universités qui correspondent à votre profil'
    },
    {
      id: 'calculator',
      name: 'Calculateur de Score', 
      icon: CalculatorIcon,
      description: "Évaluez vos chances d'admission avec notre calculateur précis"
    },
    {
      id: 'test',
      name: "Test d'Orientation",
      icon: ClipboardDocumentCheckIcon,
      description: 'Découvrez les domaines qui correspondent le mieux à vos compétences'
    }
  ];

  const renderContent = () => {
    switch (activeContent) {
      case 'university':
        return <UniversityGuide />;
      case 'calculator':
        return <ScoreCalculator />;
      case 'test':
        return <InteractiveTest />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        title="Orientation"
        subtitle="Découvrez votre parcours idéal et planifiez votre avenir académique avec confiance"
        highlight="universitaire"
        tag="Votre futur commence ici"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="space-y-2 bg-white rounded-xl shadow-sm p-4">
              {menuItems.map((item) => {
                const isActive = activeContent === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveContent(item.id as ContentType)}
                    className={`w-full flex items-center px-4 py-4 text-left rounded-lg transition-all duration-200 
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon 
                      className={`flex-shrink-0 h-6 w-6 mr-4 
                        ${isActive ? 'text-blue-600' : 'text-gray-400'}`} 
                    />
                    <div>
                      <span className={`block font-medium 
                        ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                        {item.name}
                      </span>
                      <span className="mt-1 text-sm text-gray-500">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-6 sm:px-8">
                {activeContent !== 'university' && (
                  <button
                    onClick={() => setActiveContent('university')}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 
                      transition-colors duration-200"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Retour à l'orientation
                  </button>
                )}
                <div className="transition-all duration-300 ease-in-out">
                  {renderContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Orientation;