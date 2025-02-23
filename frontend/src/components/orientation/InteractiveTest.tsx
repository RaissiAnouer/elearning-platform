import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InteractiveTest: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  
  // Assuming you have some way to check if user is authenticated
  const isAuthenticated = localStorage.getItem('token') !== null; // Replace with your auth check

  const handleStartTest = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    window.open('https://framaforms.org/les-collegiens-et-lyceens-et-lintelligence-artificielle-1732377769', '_blank');
  };

  const handleNavigateToAuth = (type: 'login' | 'register') => {
    navigate(`/auth/${type}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Intelligence Artificielle - Test Interactif
          </h2>
          <p className="text-gray-600">
            Découvrez votre rapport avec l'IA à travers notre questionnaire détaillé
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Pourquoi participer ?</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Évaluez votre compréhension de l'IA</li>
              <li>Contribuez à une étude importante sur l'IA dans l'éducation</li>
              <li>Recevez des insights personnalisés</li>
              <li>Temps estimé : 10-15 minutes</li>
            </ul>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Ce questionnaire fait partie d'une étude sur l'utilisation et la perception 
              de l'intelligence artificielle par les étudiants. Vos réponses nous aideront 
              à mieux comprendre et améliorer l'intégration de l'IA dans l'éducation.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleStartTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg 
                     flex items-center gap-2 transition-colors duration-200"
          >
            Commencer le Test
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
              />
            </svg>
          </button>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Authentification Requise</h3>
              <p className="text-gray-600 mb-6">
                Pour accéder aux détails et passer le test, veuillez vous connecter ou créer un compte.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleNavigateToAuth('login')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Se Connecter
                </button>
                <button
                  onClick={() => handleNavigateToAuth('register')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Créer un Compte
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveTest;