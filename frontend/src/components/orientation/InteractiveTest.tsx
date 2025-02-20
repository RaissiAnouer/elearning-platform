import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Question {
  id: number;
  text: string;
  options: string[];
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Which of these is the most secure password?",
    options: ["password123", "P@ssw0rd2023!", "mybirthday", "qwerty"],
    category: "Security"
  },
  {
    id: 2,
    text: "What is the primary purpose of a firewall?",
    options: ["Monitor network traffic", "Speed up internet", "Store data", "Play games"],
    category: "Security"
  },
  {
    id: 3,
    text: "Which file format is commonly used for spreadsheets?",
    options: [".xlsx", ".txt", ".jpg", ".mp3"],
    category: "Office Tools"
  },
  {
    id: 4,
    text: "What does 'CC' mean in email?",
    options: ["Carbon Copy", "Computer Copy", "Content Copy", "Custom Contact"],
    category: "Communication"
  },
  {
    id: 5,
    text: "Which cloud storage service is provided by Google?",
    options: ["Google Drive", "iCloud", "Dropbox", "OneDrive"],
    category: "Cloud Computing"
  },
  {
    id: 6,
    text: "What is phishing?",
    options: ["A cyber attack to steal personal information", "A computer virus", "A networking protocol", "A backup method"],
    category: "Security"
  },
  {
    id: 7,
    text: "Which keyboard shortcut is used to copy?",
    options: ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+Z"],
    category: "Basic Skills"
  },
  {
    id: 8,
    text: "What type of file has a .pdf extension?",
    options: ["Document", "Image", "Video", "Audio"],
    category: "File Management"
  },
  {
    id: 9,
    text: "What is a URL?",
    options: ["Web address", "Email address", "IP address", "MAC address"],
    category: "Internet"
  },
  {
    id: 10,
    text: "Which of these is a web browser?",
    options: ["Chrome", "Excel", "Photoshop", "Spotify"],
    category: "Internet"
  },
  {
    id: 11,
    text: "What does WiFi stand for?",
    options: ["Wireless Fidelity", "Wide Fiber", "Web Filter", "Wireless File"],
    category: "Networking"
  },
  {
    id: 12,
    text: "Which social media platform uses a bird logo?",
    options: ["Twitter", "Facebook", "Instagram", "LinkedIn"],
    category: "Social Media"
  },
  {
    id: 13,
    text: "What is the main function of an antivirus program?",
    options: ["Protect from malware", "Edit photos", "Send emails", "Create documents"],
    category: "Security"
  },
  {
    id: 14,
    text: "Which file format is used for compressed files?",
    options: [".zip", ".doc", ".png", ".wav"],
    category: "File Management"
  },
  {
    id: 15,
    text: "What does HTML stand for?",
    options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Text Making Links"],
    category: "Web"
  },
  {
    id: 16,
    text: "Which of these is a search engine?",
    options: ["Google", "Windows", "Office", "Outlook"],
    category: "Internet"
  },
  {
    id: 17,
    text: "What is the purpose of a USB port?",
    options: ["Connect devices", "Print documents", "Send emails", "Browse internet"],
    category: "Hardware"
  },
  {
    id: 18,
    text: "Which file extension is typically used for image files?",
    options: [".jpg", ".doc", ".mp3", ".exe"],
    category: "File Management"
  },
  {
    id: 19,
    text: "What is a cookie in web browsing context?",
    options: ["Data stored by websites", "Computer virus", "Email attachment", "Video file"],
    category: "Internet"
  },
  {
    id: 20,
    text: "Which of these is a valid email address format?",
    options: ["user@domain.com", "user.domain.com", "www.user@domain", "http://user.com"],
    category: "Communication"
  }
];

const InteractiveTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      setIsCompleted(true);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-8">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Test Complété !
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Félicitations ! Nous avons analysé vos réponses et préparé des recommandations personnalisées pour votre orientation.
        </p>
        <div className="bg-blue-50 rounded-xl p-6 text-left">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">
            Vos Domaines Recommandés
          </h3>
          {/* Add personalized recommendations based on answers */}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress section */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} sur {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question section */}
      <div className="mb-8">
        <span className="text-sm font-medium text-blue-600 mb-2 block">
          {question.category}
        </span>
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">
          {question.text}
        </h3>
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              className="w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 
                hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTest;