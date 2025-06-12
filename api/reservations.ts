import api from './axios';

export interface Reservation {
  id: number;
  customer_id: number;
  table_id: number;
  reservation_date: string;
  reservation_time: string;
  status: string;
}

export interface CreateReservationDTO {
  customer_id: number;
  table_id: number;
  reservation_date: string;
  reservation_time: string;
}

// Obtener todas las reservas
export const getAllReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await api.get<{ data: Reservation[] }>('/reservations');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    throw error;
  }
};

// Crear una nueva reserva
export const createReservation = async (reservation: CreateReservationDTO): Promise<Reservation> => {
  try {
    // Asegurarnos de que los IDs sean números
    const formattedReservation = {
      ...reservation,
      customer_id: Number(reservation.customer_id),
      table_id: Number(reservation.table_id)
    }
    
    const response = await api.post<{ data: Reservation }>('/reservations', formattedReservation);
    return response.data.data;
  } catch (error: any) {
    console.error('Error al crear la reserva:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      if (error.response.status === 400) {
        throw new Error('Los datos de la reserva no son válidos. Por favor, verifica la información.');
      }
      if (error.response.status === 404) {
        throw new Error('No se encontró el recurso solicitado.');
      }
      if (error.response.status === 500) {
        throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
      }
    }
    
    // Si no hay respuesta del servidor
    if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
    }
    
    // Error en la configuración de la petición
    throw new Error('Error al procesar la solicitud. Por favor, intenta nuevamente.');
  }
};

// Obtener una reserva por ID
export const getReservationById = async (id: number): Promise<Reservation> => {
  try {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la reserva ${id}:`, error);
    throw error;
  }
};

// Actualizar una reserva
export const updateReservation = async (id: number, reservation: Partial<CreateReservationDTO>): Promise<Reservation> => {
  try {
    const response = await api.put<Reservation>(`/reservations/${id}`, reservation);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la reserva ${id}:`, error);
    throw error;
  }
};

// Eliminar una reserva
export const deleteReservation = async (id: number): Promise<void> => {
  try {
    await api.delete(`/reservations/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la reserva ${id}:`, error);
    throw error;
  }
}; 