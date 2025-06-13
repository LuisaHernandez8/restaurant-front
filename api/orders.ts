import api from "./axios"

export interface OrderDetail {
  dish_id: number
  dish_name: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  customer_id: number
  order_date: string
  total: string
  customer_name: string
  order_details: OrderDetail[]
}

export interface CreateOrderDTO {
  customer_id: number
  dishes: {
    dish_id: number
    quantity: number
  }[]
}

export const getOrders = async (): Promise<Order[]> => {
    try {
    const response = await api.get<{ message: string; data: Order[] }>("/orders")
    return response.data.data
    } catch (error) {
        console.error("Error fetching orders:", error)
        throw error
    }
}

export const createOrder = async (order: CreateOrderDTO): Promise<Order> => {
    try {
    const response = await api.post<{ message: string; data: Order }>("/orders", order)
    return response.data.data
    } catch (error) {
        console.error("Error creating order:", error)
        throw error
    }
}