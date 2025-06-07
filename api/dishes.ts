import api from './axios';

export const getDishes = async () => {
  try {
    const response = await api.get('/dishes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener platos:', error);
    throw error;
  }
};

export const createDish = async (data: any) => {
  try {
    const response = await api.post('/dishes', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear plato:', error);
    throw error;
  }
};
