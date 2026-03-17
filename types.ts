
export interface Assessment {
  type: string;
}

export interface Program {
  name: string;
  duration: string;
  format: string;
  assessment: string[];
  keyTopics: string[];
  certification: string;
  validity: string;
  refresh: string;
  timeline: string;
  resitPolicy: string;
  audience: string;
}

export interface CourseVideo {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: string;
}

export interface Course {
  id: string;
  title: string;
  mainTitle: string;
  image: string;
  bannerImage?: string;
  subcategories: string[];
  description: string;
  fee: string;
  duration: string;
  courseType: 'campus' | 'video'; // New: Identifies course category
  details: {
    programs: Program[];
  };
  videos?: CourseVideo[];
}

export interface Review {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: number;
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  desc?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  createdAt: any;
}

export interface Certificate {
  id: string;
  studentName: string;
  fatherName: string;
  courseName: string;
  issuedDate: string;
  serialNumber: string;
  certificateImage: string;
  createdAt: any;
}
