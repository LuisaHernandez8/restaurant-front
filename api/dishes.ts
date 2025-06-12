import api from './axios';

export interface Dish {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export interface CreateDishDTO {
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export const getDishes = async (): Promise<Dish[]> => {
  try {
    const response = await api.get<{ data: Dish[] }>('/dishes');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener platos:', error);
    throw error;
  }
};

export const createDish = async (data: CreateDishDTO): Promise<Dish> => {
  try {
    const response = await api.post<{ data: Dish }>('/dishes', data);
    return response.data.data;
  } catch (error) {
    console.error('Error al crear plato:', error);
    throw error;
  }
};
