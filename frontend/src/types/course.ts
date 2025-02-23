export interface Document {
  _id: string;
  title: string;
  url: string;
  type: string;
  size: string;
  createdAt: string;
  description?: string;
  category?: string;
}

export interface Video {
  _id: string;
  title: string;
  url: string;
  duration: string;
  createdAt: string;
  description?: string;
}

export interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  icon?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  students: number;
  rating: number;
  instructor: string;
  duration: number;
  price: number;
  category: string;
  enrolledCount: number;
  whatYouWillLearn?: string[];
  requirements?: string[];
  targetAudience?: string[];
  videos: Video[];
  documents: Document[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
} 