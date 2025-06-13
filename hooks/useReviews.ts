import { useState, useCallback } from 'react';
import { getAllReviews, createReview, type Review } from '@/api/reviews';
import { toast } from 'sonner';

interface ApiResponse {
  message: string;
  data: Review[];
}

type NewReview = Omit<Review, '_id' | 'createdAt' | '__v'>;

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllReviews();
      const apiResponse = response as ApiResponse;
      setReviews(Array.isArray(apiResponse.data) ? apiResponse.data : []);
    } catch (err) {
      setError('Error al cargar las reseñas');
      toast.error('Error al cargar las reseñas');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReview = useCallback(async (review: NewReview) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await createReview(review);
      const apiResponse = response as ApiResponse;
      const newReview = apiResponse.data[0];
      setReviews(prev => [...prev, newReview]);
      toast.success('Reseña creada exitosamente');
      return newReview;
    } catch (err) {
      setError('Error al crear la reseña');
      toast.error('Error al crear la reseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    addReview
  };
}; 