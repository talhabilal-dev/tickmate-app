import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API endpoints
export const authApi = {
  signUp: async (data: {
    name: string
    email: string
    username: string
    password: string
    skills?: string[]
  }) => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  signIn: async (data: {
    identifier: string
    password: string
    role?: 'user' | 'admin'
  }) => {
    const endpoint = data.role === 'admin' ? '/admin/login' : '/auth/login'
    const response = await apiClient.post(endpoint, data)
    return response.data
  },

  checkUsernameAvailability: async (username: string) => {
    const response = await apiClient.get(`/auth/check-username/${username}`)
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify-email', { token })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },
}

// User API endpoints
export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  updateProfile: async (data: {
    name?: string
    username?: string
    email?: string
    skills?: string[]
  }) => {
    const response = await apiClient.patch('/auth/profile', data)
    return response.data
  },

  changePassword: async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    const response = await apiClient.post('/user/change-password', data)
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/user/verify-email', { token })
    return response.data
  },
}

// Ticket API endpoints
export const ticketApi = {
  getMyTickets: async () => {
    const response = await apiClient.get('/tickets')
    return response.data
  },

  getTicketStats: async () => {
    const response = await apiClient.get('/tickets/tickets-summary')
    return response.data
  },

  createTicket: async (data: {
    title: string
    description: string
    category: string
    priority?: 'low' | 'medium' | 'high'
    deadline?: Date
    relatedSkills?: string[]
    helpfulNotes?: string
    isPublic?: boolean
  }) => {
    const response = await apiClient.post('/tickets', data)
    return response.data
  },

  searchSimilarTickets: async (data: {
    title: string
    description: string
    category?: string
    limit?: number
  }) => {
    const response = await apiClient.post('/tickets/search-similar', data)
    return response.data
  },

  getTicketById: async (ticketId: number) => {
    const response = await apiClient.get(`/tickets/${ticketId}`)
    return response.data
  },

  updateTicket: async (data: {
    ticketId: number
    title?: string
    description?: string
    category?: string
    deadline?: Date | null
    status?: 'pending' | 'in_progress' | 'completed'
    priority?: 'low' | 'medium' | 'high'
    helpfulNotes?: string | null
    relatedSkills?: string[]
    isPublic?: boolean
  }) => {
    const { ticketId, ...updateData } = data
    const response = await apiClient.put(`/tickets/${ticketId}`, updateData)
    return response.data
  },

  deleteTicket: async (ticketId: number) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`)
    return response.data
  },
}

export default apiClient
