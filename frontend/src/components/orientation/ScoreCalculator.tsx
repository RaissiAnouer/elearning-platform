import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalculatorIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

type Section = 'math' | 'exp' | 'tech' | 'letters' | 'eco' | 'sport' | 'info';

interface Subject {
  code: string;
  name: string;
  coefficient: number;
}

interface Formula {
  subjects: { [key: string]: number };
  name: string;
}

const SUBJECTS: { [key: string]: string } = {
  MG: "Moyenne générale du baccalauréat",
  M: "Mathématiques",
  SP: "Sciences physiques",
  SVT: "Sciences de la vie et de la terre",
  F: "Français",
  Ang: "Anglais",
  TE: "Technologie",
  A: "Arabe",
  PH: "Philosophie",
  HG: "Histoire-géographie",
  Ec: "Économie",
  Ge: "Gestion",
  SB: "Sciences biologiques",
  "Sp-sport": "Sport spécialisé",
  EP: "Éducation physique",
  Algo: "Algorithmique et programmation",
  STI: "Systèmes et technologies de l'information"
};

const FORMULAS: { [key in Section]: Formula } = {
  math: {
    name: "Mathématiques",
    subjects: { MG: 4, M: 2, SP: 1.5, SVT: 0.5, F: 1, Ang: 1 }
  },
  exp: {
    name: "Sciences Expérimentales",
    subjects: { MG: 4, M: 1, SP: 1.5, SVT: 1.5, F: 1, Ang: 1 }
  },
  tech: {
    name: "Sciences Techniques",
    subjects: { MG: 4, TE: 1.5, M: 1.5, SP: 1, F: 1, Ang: 1 }
  },
  letters: {
    name: "Lettres",
    subjects: { MG: 4, A: 1.5, PH: 1.5, HG: 1, F: 1, Ang: 1 }
  },
  eco: {
    name: "Économie et Gestion",
    subjects: { MG: 4, Ec: 1.5, Ge: 1.5, M: 0.5, HG: 0.5, F: 1, Ang: 1 }
  },
  sport: {
    name: "Sport",
    subjects: { MG: 4, SB: 1.5, "Sp-sport": 1, EP: 0.5, SP: 0.5, PH: 0.5, F: 1, Ang: 1 }
  },
  info: {
    name: "Sciences de l'Informatique",
    subjects: { MG: 4, M: 1.5, Algo: 1.5, SP: 0.5, STI: 0.5, F: 1, Ang: 1 }
  }
};

const ScoreCalculator = () => {
  const [selectedSection, setSelectedSection] = useState<Section>('math');
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [controlScores, setControlScores] = useState<{ [key: string]: number }>({});
  const [isControl, setIsControl] = useState(false);

  const handleScoreChange = (subject: string, value: string, isControlSession: boolean = false) => {
    const score = parseFloat(value);
    if (!isNaN(score) && score >= 0 && score <= 20) {
      if (isControlSession) {
        setControlScores(prev => ({ ...prev, [subject]: score }));
      } else {
        setScores(prev => ({ ...prev, [subject]: score }));
      }
    }
  };

  const calculateFinalScore = () => {
    const formula = FORMULAS[selectedSection];
    let total = 0;

    Object.entries(formula.subjects).forEach(([subject, coef]) => {
      const score = scores[subject] || 0;
      const controlScore = controlScores[subject] || 0;
      
      let finalScore = score;
      if (isControl) {
        finalScore = ((2 * score) + controlScore) / 3;
      }

      total += finalScore * coef;
    });

    return total;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <CalculatorIcon className="h-16 w-16 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculateur de Score
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculez votre score d'orientation selon votre section et vos notes au baccalauréat
          </p>
        </div>

        {/* Section Selection */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2 text-blue-600" />
            Choisissez votre section
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(FORMULAS).map(([key, formula]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSection(key as Section)}
                className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center h-24
                  ${selectedSection === key 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="text-center">{formula.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          {/* Control Session Toggle */}
          <div className="mb-8">
            <label className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                checked={isControl}
                onChange={(e) => setIsControl(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">
                Session de contrôle
              </span>
            </label>
          </div>

          {/* Score Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(FORMULAS[selectedSection].subjects).map(([subject, coef]) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 p-4 rounded-xl space-y-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  {SUBJECTS[subject]}
                </label>
                <div className="text-xs text-blue-600 font-medium mb-2">
                  Coefficient: {coef}
                </div>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  placeholder="0-20"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  onChange={(e) => handleScoreChange(subject, e.target.value)}
                />
                {isControl && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="Note de contrôle (0-20)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    onChange={(e) => handleScoreChange(subject, e.target.value, true)}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Final Score Display */}
          <motion.div
            layout
            className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg"
          >
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Score Final</h3>
              <div className="text-5xl font-bold mb-4">
                {calculateFinalScore().toFixed(2)}
              </div>
              <p className="text-blue-100">
                Score calculé pour {FORMULAS[selectedSection].name}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScoreCalculator;