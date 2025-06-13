import api from './axios';

export interface Review {
  _id: string;
  name: string;
  email: string;
  visitType: string;
  visitDate: string;
  calification: number;
  consumedDishes: string[];
  comment: string;
  createdAt: string;
  __v: number;
}

export const getAllReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReview = async (review: Omit<Review, '_id' | 'createdAt' | '__v'>) => {
  try {
    const response = await api.post('/reviews', review);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (id: string) => {
  try {
    await api.delete(`/reviews/${id}`);
  } catch (error) {
    throw error;
  }
};