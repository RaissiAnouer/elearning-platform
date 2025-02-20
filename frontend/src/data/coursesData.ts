export interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  category: string;
  rating: number;
  enrolledCount: number;
  image: string;
  price: number;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  videos: {
    id: number;
    title: string;
    duration: string;
    thumbnail: string;
  }[];
  documents: {
    id: number;
    title: string;
    type: string;
    size: string;
  }[];
}

export const coursesData: Course[] = [
  {
    id: 1,
    title: "Python pour Débutants : De Zéro à Héros",
    instructor: "Dr. Ahmed Ben Ali",
    duration: "20 heures",
    category: "Python",
    rating: 4.8,
    enrolledCount: 2500,
    image: "/images/courses/python-basics.jpg",
    price: 149.99,
    description: `Ce cours complet de Python vous fait passer de débutant absolu à développeur Python professionnel.
    Apprenez les fondamentaux de Python, les structures de données, les algorithmes et les meilleures pratiques
    à travers des projets pratiques et des exemples concrets.`,
    whatYouWillLearn: [
      "Fondamentaux et syntaxe Python",
      "Concepts de programmation orientée objet",
      "Structures de données et algorithmes",
      "Manipulation de fichiers et opérations de base de données",
      "Développement web avec Python",
      "Meilleures pratiques et normes de codage"
    ],
    requirements: [
      "Aucune expérience en programmation requise",
      "Compétences de base en informatique",
      "Volonté d'apprendre et de pratiquer"
    ],
    videos: [
      {
        id: 1,
        title: "Introduction à Python",
        duration: "15:30",
        thumbnail: "/images/courses/python-basics/video-1.jpg"
      },
      {
        id: 2,
        title: "Variables et Types de Données",
        duration: "25:45",
        thumbnail: "/images/courses/python-basics/video-2.jpg"
      },
      {
        id: 3,
        title: "Flux de Contrôle : Instructions If",
        duration: "20:15",
        thumbnail: "/images/courses/python-basics/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Guide du Cours PDF",
        type: "pdf",
        size: "2.5 MB"
      },
      {
        id: 2,
        title: "Aide-mémoire Python",
        type: "pdf",
        size: "1.8 MB"
      },
      {
        id: 3,
        title: "Exercices Pratiques",
        type: "zip",
        size: "5.2 MB"
      }
    ]
  },
  {
    id: 2,
    title: "Python Avancé : Science des Données et Machine Learning",
    instructor: "Dr. Sarah Mansour",
    duration: "25 heures",
    category: "Python",
    rating: 4.9,
    enrolledCount: 1800,
    image: "/images/courses/python-advanced.jpg",
    price: 199.99,
    description: `Portez vos compétences Python au niveau supérieur avec ce cours avancé axé sur la Science des Données
    et le Machine Learning. Apprenez à analyser les données, construire des modèles prédictifs et implémenter
    des algorithmes de machine learning en utilisant les puissantes bibliothèques Python.`,
    whatYouWillLearn: [
      "Manipulation de données avec NumPy et Pandas",
      "Visualisation de données avec Matplotlib et Seaborn",
      "Machine Learning avec Scikit-learn",
      "Fondamentaux du Deep Learning avec TensorFlow",
      "Analyse statistique et tests d'hypothèses",
      "Projets réels de science des données"
    ],
    requirements: [
      "Connaissances de base en programmation Python",
      "Compréhension des mathématiques et statistiques de base",
      "Familiarité avec les concepts de programmation"
    ],
    videos: [
      {
        id: 1,
        title: "Introduction à la Science des Données",
        duration: "20:15",
        thumbnail: "/images/courses/python-advanced/video-1.jpg"
      },
      {
        id: 2,
        title: "Fondamentaux de NumPy et Pandas",
        duration: "35:20",
        thumbnail: "/images/courses/python-advanced/video-2.jpg"
      },
      {
        id: 3,
        title: "Bases du Machine Learning",
        duration: "45:10",
        thumbnail: "/images/courses/python-advanced/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Manuel de Science des Données",
        type: "pdf",
        size: "4.5 MB"
      },
      {
        id: 2,
        title: "Aide-mémoire Algorithmes ML",
        type: "pdf",
        size: "2.3 MB"
      },
      {
        id: 3,
        title: "Jeux de Données Projets",
        type: "zip",
        size: "150 MB"
      }
    ]
  },
  {
    id: 3,
    title: "Maîtrisez Microsoft Office 365",
    instructor: "Leila Karim",
    duration: "15 heures",
    category: "Office 365",
    rating: 4.7,
    enrolledCount: 3200,
    image: "/images/courses/office365.jpg",
    price: 99.99,
    description: `Maîtrisez la suite complète Microsoft Office 365 avec ce cours complet.
    Apprenez à utiliser efficacement Word, Excel, PowerPoint et Outlook pour la création de documents,
    l'analyse de données, les présentations et la gestion des e-mails.`,
    whatYouWillLearn: [
      "Formatage avancé de documents Word et styles",
      "Formules Excel, tableaux croisés dynamiques et analyse de données",
      "Présentations PowerPoint professionnelles",
      "Gestion des e-mails et fonctionnalités du calendrier Outlook",
      "Collaboration avec OneDrive et SharePoint",
      "Microsoft Teams pour la communication professionnelle"
    ],
    requirements: [
      "Compétences de base en informatique",
      "Abonnement Microsoft Office 365",
      "Ordinateur Windows ou Mac"
    ],
    videos: [
      {
        id: 1,
        title: "Débuter avec Office 365",
        duration: "18:45",
        thumbnail: "/images/courses/office365/video-1.jpg"
      },
      {
        id: 2,
        title: "Word : Formatage Avancé de Documents",
        duration: "32:15",
        thumbnail: "/images/courses/office365/video-2.jpg"
      },
      {
        id: 3,
        title: "Excel : Essentiels de l'Analyse de Données",
        duration: "40:20",
        thumbnail: "/images/courses/office365/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Guide de Démarrage Office 365",
        type: "pdf",
        size: "3.2 MB"
      },
      {
        id: 2,
        title: "Référence des Fonctions Excel",
        type: "pdf",
        size: "2.1 MB"
      },
      {
        id: 3,
        title: "Fichiers d'Exercices",
        type: "zip",
        size: "45 MB"
      }
    ]
  },
  {
    id: 4,
    title: "Excel Avancé pour l'Analyse de Données",
    instructor: "Mohamed Slim",
    duration: "12 heures",
    category: "Office 365",
    rating: 4.6,
    enrolledCount: 1500,
    image: "/images/courses/excel-advanced.jpg",
    price: 79.99,
    description: `Portez vos compétences Excel à un niveau avancé avec ce cours spécialisé.
    Maîtrisez les formules complexes, les outils d'analyse de données, l'automatisation avec VBA
    et créez des tableaux de bord professionnels pour la visualisation des données.`,
    whatYouWillLearn: [
      "Formules et fonctions Excel avancées",
      "Tableaux croisés dynamiques et Power Pivot",
      "Analyse de données avec Power Query",
      "Programmation VBA et macros",
      "Création de tableaux de bord et visualisation",
      "Business Intelligence avec Excel"
    ],
    requirements: [
      "Connaissances de base d'Excel",
      "Microsoft Excel 2019 ou Office 365",
      "Compréhension des mathématiques de base"
    ],
    videos: [
      {
        id: 1,
        title: "Fonctions Excel Avancées",
        duration: "28:15",
        thumbnail: "/images/courses/excel-advanced/video-1.jpg"
      },
      {
        id: 2,
        title: "Maîtriser les Tableaux Croisés Dynamiques",
        duration: "35:40",
        thumbnail: "/images/courses/excel-advanced/video-2.jpg"
      },
      {
        id: 3,
        title: "Introduction au VBA",
        duration: "42:30",
        thumbnail: "/images/courses/excel-advanced/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Guide des Techniques Excel Avancées",
        type: "pdf",
        size: "4.8 MB"
      },
      {
        id: 2,
        title: "Référence Programmation VBA",
        type: "pdf",
        size: "3.2 MB"
      },
      {
        id: 3,
        title: "Classeurs d'Exercices",
        type: "zip",
        size: "25 MB"
      }
    ]
  },
  {
    id: 5,
    title: "Programmation Créative avec Scratch",
    instructor: "Amira Benali",
    duration: "10 heures",
    category: "Scratch",
    rating: 4.9,
    enrolledCount: 950,
    image: "/images/courses/scratch.jpg",
    price: 49.99,
    description: `Découvrez la joie de la programmation avec Scratch ! Ce cours est parfait pour les débutants
    et les jeunes apprenants. Apprenez à créer des histoires interactives, des jeux et des animations tout
    en développant des compétences en pensée computationnelle.`,
    whatYouWillLearn: [
      "Interface Scratch et concepts de base de programmation",
      "Animation et manipulation de sprites",
      "Gestion des événements et interaction utilisateur",
      "Variables et gestion des données",
      "Boucles et instructions conditionnelles",
      "Intégration du son et du multimédia"
    ],
    requirements: [
      "Aucune expérience en programmation requise",
      "Compétences de base en informatique",
      "Connexion Internet pour la plateforme Scratch en ligne"
    ],
    videos: [
      {
        id: 1,
        title: "Débuter avec Scratch",
        duration: "22:15",
        thumbnail: "/images/courses/scratch/video-1.jpg"
      },
      {
        id: 2,
        title: "Créer Votre Première Animation",
        duration: "28:30",
        thumbnail: "/images/courses/scratch/video-2.jpg"
      },
      {
        id: 3,
        title: "Narration Interactive",
        duration: "35:45",
        thumbnail: "/images/courses/scratch/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Guide des Bases de Scratch",
        type: "pdf",
        size: "2.8 MB"
      },
      {
        id: 2,
        title: "Modèles de Projets",
        type: "zip",
        size: "15 MB"
      },
      {
        id: 3,
        title: "Cahier d'Exercices Créatifs",
        type: "pdf",
        size: "3.5 MB"
      }
    ]
  },
  {
    id: 6,
    title: "Jeux Vidéo avec Scratch : Projets Pratiques",
    instructor: "Yassine Karray",
    duration: "8 heures",
    category: "Scratch",
    rating: 4.8,
    enrolledCount: 750,
    image: "/images/courses/scratch-games.jpg",
    price: 59.99,
    description: `Créez des jeux vidéo passionnants avec Scratch ! Ce cours basé sur des projets vous
    enseigne les fondamentaux du développement de jeux à travers des exemples pratiques. Créez plusieurs
    jeux de A à Z, incluant des jeux de plateforme, d'arcade et des aventures interactives.`,
    whatYouWillLearn: [
      "Principes de conception de jeux",
      "Mouvements des personnages et contrôles",
      "Détection des collisions",
      "Suivi des scores et mécaniques de jeu",
      "Conception de niveaux multiples",
      "Physique et animations de jeu"
    ],
    requirements: [
      "Connaissances de base de Scratch",
      "Avoir suivi le cours Programmation Créative avec Scratch ou expérience équivalente",
      "Enthousiasme pour le développement de jeux"
    ],
    videos: [
      {
        id: 1,
        title: "Fondamentaux du Game Design",
        duration: "25:10",
        thumbnail: "/images/courses/scratch-games/video-1.jpg"
      },
      {
        id: 2,
        title: "Création d'un Jeu de Plateforme",
        duration: "40:20",
        thumbnail: "/images/courses/scratch-games/video-2.jpg"
      },
      {
        id: 3,
        title: "Création d'un Jeu d'Arcade",
        duration: "38:15",
        thumbnail: "/images/courses/scratch-games/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Modèle de Document de Game Design",
        type: "pdf",
        size: "1.5 MB"
      },
      {
        id: 2,
        title: "Pack de Ressources de Jeu",
        type: "zip",
        size: "25 MB"
      },
      {
        id: 3,
        title: "Guide de Développement de Jeux",
        type: "pdf",
        size: "4.2 MB"
      }
    ]
  },
  {
    id: 7,
    title: "Algorithmes et Structures de Données",
    instructor: "Prof. Kamel Gharbi",
    duration: "30 heures",
    category: "Algorithmes",
    rating: 4.7,
    enrolledCount: 1200,
    image: "/images/courses/algorithms.jpg",
    price: 179.99,
    description: `Maîtrisez les algorithmes et structures de données fondamentaux essentiels pour tout programmeur.
    Ce cours complet couvre tout, des structures de données de base aux techniques algorithmiques avancées.
    Apprenez à travers des implémentations pratiques, l'analyse de complexité et la résolution de problèmes réels.`,
    whatYouWillLearn: [
      "Tableaux, Listes, Piles et Files",
      "Arbres, Graphes et Tables de Hachage",
      "Algorithmes de Tri et de Recherche",
      "Programmation Dynamique",
      "Analyse d'Algorithmes et Notation Big O",
      "Stratégies de Résolution de Problèmes"
    ],
    requirements: [
      "Expérience en programmation dans n'importe quel langage",
      "Connaissances de base en mathématiques",
      "Compréhension des concepts de programmation de base"
    ],
    videos: [
      {
        id: 1,
        title: "Introduction aux Structures de Données",
        duration: "45:20",
        thumbnail: "/images/courses/algorithms/video-1.jpg"
      },
      {
        id: 2,
        title: "Exploration des Algorithmes de Tri",
        duration: "52:15",
        thumbnail: "/images/courses/algorithms/video-2.jpg"
      },
      {
        id: 3,
        title: "Algorithmes de Graphes",
        duration: "48:30",
        thumbnail: "/images/courses/algorithms/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Guide d'Analyse d'Algorithmes",
        type: "pdf",
        size: "5.5 MB"
      },
      {
        id: 2,
        title: "Exemples d'Implémentation de Code",
        type: "zip",
        size: "8.2 MB"
      },
      {
        id: 3,
        title: "Ensemble de Problèmes Pratiques",
        type: "pdf",
        size: "3.8 MB"
      }
    ]
  },
  {
    id: 8,
    title: "Préparation aux Entretiens Techniques",
    instructor: "Dr. Nadia Touati",
    duration: "20 heures",
    category: "Algorithmes",
    rating: 4.9,
    enrolledCount: 890,
    image: "/images/courses/tech-interview.jpg",
    price: 199.99,
    description: `Réussissez vos entretiens techniques avec ce cours de préparation complet. Apprenez à résoudre
    des défis de codage, expliquer votre processus de réflexion et gérer les scénarios d'entretien courants.
    Inclut des simulations d'entretiens, des stratégies de résolution de problèmes et une pratique extensive.`,
    whatYouWillLearn: [
      "Techniques de résolution de problèmes",
      "Modèles d'entretien courants",
      "Bases de la conception système",
      "Préparation aux entretiens comportementaux",
      "Optimisation de la complexité temporelle",
      "Pratique d'entretiens simulés"
    ],
    requirements: [
      "Solides bases en programmation",
      "Connaissance des structures de données et algorithmes",
      "Expérience dans au moins un langage de programmation"
    ],
    videos: [
      {
        id: 1,
        title: "Vue d'ensemble de la Stratégie d'Entretien",
        duration: "35:45",
        thumbnail: "/images/courses/tech-interview/video-1.jpg"
      },
      {
        id: 2,
        title: "Résolution de Problèmes sur les Tableaux",
        duration: "42:20",
        thumbnail: "/images/courses/tech-interview/video-2.jpg"
      },
      {
        id: 3,
        title: "Entretien de Conception Système",
        duration: "55:15",
        thumbnail: "/images/courses/tech-interview/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Guide de Préparation aux Entretiens",
        type: "pdf",
        size: "4.2 MB"
      },
      {
        id: 2,
        title: "Collection de Problèmes Pratiques",
        type: "pdf",
        size: "6.5 MB"
      },
      {
        id: 3,
        title: "Solutions de Code",
        type: "zip",
        size: "12 MB"
      }
    ]
  },
  {
    id: 9,
    title: "Bootcamp Développement Web",
    instructor: "Sami Mejri",
    duration: "40 heures",
    category: "Web Development",
    rating: 4.8,
    enrolledCount: 2800,
    image: "/images/courses/web-dev.jpg",
    price: 249.99,
    description: `Devenez développeur web full-stack dans ce bootcamp complet. Apprenez les technologies
    modernes du développement web, du front-end au back-end. Construisez des projets réels en utilisant
    les derniers frameworks et outils. Parfait pour les débutants et ceux qui souhaitent améliorer leurs compétences.`,
    whatYouWillLearn: [
      "HTML5, CSS3 et JavaScript Moderne",
      "React.js et Gestion d'État",
      "Node.js et Express.js",
      "Conception de Base de Données avec MongoDB",
      "Développement d'API RESTful",
      "Bases du Déploiement et DevOps"
    ],
    requirements: [
      "Connaissances de base en informatique",
      "Compréhension des concepts web",
      "Engagement à pratiquer et construire des projets"
    ],
    videos: [
      {
        id: 1,
        title: "Fondamentaux du Développement Web",
        duration: "48:30",
        thumbnail: "/images/courses/web-dev/video-1.jpg"
      },
      {
        id: 2,
        title: "Développement avec React",
        duration: "55:20",
        thumbnail: "/images/courses/web-dev/video-2.jpg"
      },
      {
        id: 3,
        title: "Développement Backend",
        duration: "50:15",
        thumbnail: "/images/courses/web-dev/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Manuel de Développement Web",
        type: "pdf",
        size: "8.5 MB"
      },
      {
        id: 2,
        title: "Fichiers de Démarrage des Projets",
        type: "zip",
        size: "45 MB"
      },
      {
        id: 3,
        title: "Configuration de l'Environnement de Développement",
        type: "pdf",
        size: "2.8 MB"
      }
    ]
  },
  {
    id: 10,
    title: "Science des Données : Analyse et Visualisation",
    instructor: "Dr. Rim Zouari",
    duration: "35 heures",
    category: "Data Science",
    rating: 4.9,
    enrolledCount: 1600,
    image: "/images/courses/data-science.jpg",
    price: 229.99,
    description: `Maîtrisez l'art de l'analyse et de la visualisation des données dans ce cours complet.
    Apprenez à extraire des insights de jeux de données complexes, créer des visualisations convaincantes
    et communiquer efficacement les résultats. Utilisez des outils et techniques standard de l'industrie.`,
    whatYouWillLearn: [
      "Nettoyage et prétraitement des données",
      "Techniques d'analyse statistique",
      "Visualisation de données avec Python",
      "Bases du Machine Learning",
      "Création de tableaux de bord",
      "Storytelling avec les données"
    ],
    requirements: [
      "Programmation de base en Python",
      "Compréhension des statistiques",
      "Capacités de pensée analytique"
    ],
    videos: [
      {
        id: 1,
        title: "Introduction à l'Analyse de Données",
        duration: "42:15",
        thumbnail: "/images/courses/data-science/video-1.jpg"
      },
      {
        id: 2,
        title: "Techniques de Visualisation de Données",
        duration: "38:30",
        thumbnail: "/images/courses/data-science/video-2.jpg"
      },
      {
        id: 3,
        title: "Analytique Avancée",
        duration: "45:20",
        thumbnail: "/images/courses/data-science/video-3.jpg"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Boîte à Outils Data Science",
        type: "pdf",
        size: "6.2 MB"
      },
      {
        id: 2,
        title: "Collection de Jeux de Données",
        type: "zip",
        size: "180 MB"
      },
      {
        id: 3,
        title: "Modèles de Visualisation",
        type: "zip",
        size: "25 MB"
      }
    ]
  }
]; 