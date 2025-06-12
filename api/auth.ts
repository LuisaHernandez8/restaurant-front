import api from './axios'

export type UserRole = 'client' | 'waiter' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials)
    const { user, token } = response.data.data
    
    // Guardar el token en localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    // Configurar el token en las cabeceras de axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    return response.data.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete api.defaults.headers.common['Authorization']
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  return JSON.parse(userStr)
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser()
  return user?.role === role
}

export const canAccess = (roles: UserRole[]): boolean => {
  const user = getCurrentUser()
  return user ? roles.includes(user.role) : false
} 