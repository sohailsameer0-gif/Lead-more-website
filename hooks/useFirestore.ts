
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Course, Review, TeamMember, FAQItem, Partner, GalleryItem, Certificate } from '../types';

function useCollection<T>(collectionName: string, orderByField: string = 'createdAt') {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Real-time listener for instant updates across the app
    const q = query(collection(db, collectionName), orderBy(orderByField, 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        
        setData(list as T[]);
        setLoading(false);
        setError(null);
      }, (err) => {
        // Silencing permission errors for public streams to avoid console noise
        if (err.message.includes('permission-denied') || err.message.includes('Missing or insufficient permissions')) {
          console.warn(`Firestore: ${collectionName} collection is currently restricted.`);
        } else {
          console.error(`Error in ${collectionName} stream:`, err.message);
        }
        setError(err.message);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { data, loading, error };
}

export { useCollection };

export const useCourses = () => {
  const { data, loading, error } = useCollection<Course>('courses');
  return { courses: data, loading, error };
};

export const useReviews = () => {
  const { data, loading, error } = useCollection<Review>('reviews');
  return { reviews: data, loading, error };
};

export const useTeam = () => {
  const { data, loading, error } = useCollection<TeamMember>('team');
  return { team: data, loading, error };
};

export const useFAQ = () => useCollection<FAQItem>('faq', 'question');
export const usePartners = () => useCollection<Partner>('partners', 'name');
export const useGallery = () => useCollection<GalleryItem>('gallery');

export const useMessages = () => {
  const { data, loading, error } = useCollection<any>('messages');
  return { messages: data, loading, error };
};

export const useEnrollments = () => {
  const { data, loading, error } = useCollection<any>('enrollments');
  return { enrollments: data, loading, error };
};

export const useCertificates = () => {
  const { data, loading, error } = useCollection<Certificate>('certificates');
  return { certificates: data, loading, error };
};
