import api from './axios';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}

// Obtener todos los clientes
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};

// Obtener un cliente por ID
export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el cliente ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo cliente
export const createCustomer = async (customer: CreateCustomerDTO): Promise<Customer> => {
  try {
    const response = await api.post('/customers', {
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    throw error;
  }
};

// Actualizar un cliente existente
export const updateCustomer = async (id: number, customer: UpdateCustomerDTO): Promise<Customer> => {
  try {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el cliente ${id}:`, error);
    throw error;
  }
};

// Eliminar un cliente
export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el cliente ${id}:`, error);
    throw error;
  }
}; 