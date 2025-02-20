export interface Course {
  _id?: string;
  id: string;
  title: string;
  description: string;
  icon?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  students: number;
  rating: number;
  instructor?: string;
  duration?: number;
  price: number;
  category: string;
  enrolledCount: number;
  whatYouWillLearn?: string[];
  requirements?: string[];
  targetAudience?: string[];
  videos?: {
    id: string;
    title: string;
    duration: number;
    url: string;
  }[];
  documents?: {
    id: string;
    title: string;
    type: string;
    size: string;
    url: string;
  }[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
} 