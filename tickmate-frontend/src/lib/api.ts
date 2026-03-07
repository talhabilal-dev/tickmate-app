import axios from 'axios'

const resolveApiBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  const normalized = rawUrl.replace(/\/+$/, '')

  if (normalized.endsWith('/api/auth')) {
    return normalized.slice(0, -'/auth'.length)
  }

  if (normalized.endsWith('/api')) {
    return normalized
  }

  return `${normalized}/api`
}

const API_BASE_URL = resolveApiBaseUrl()

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
  }) => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  checkUsernameAvailability: async (username: string) => {
    const response = await apiClient.get('/auth/check-username', {
      params: { username },
    })
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.post('/auth/verify', { token })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },
}

export type AdminDashboardResponse = {
  success: boolean
  adminProfile: {
    id: number
    name: string
    username: string
    email: string
    role: string
    isActive: boolean
  }
  users: Array<{
    id: number
    name: string
    email: string
    role: string
    isActive: boolean
  }>
  tickets: Array<{
    id: number
    title: string
    status: string
    priority: string
  }>
  stats: {
    totalUsers: number
    totalTickets: number
    inProgressTickets: number
    completedTickets: number
    activeUsers: number
  }
}

export const adminApi = {
  login: async (data: { identifier: string; password: string }) => {
    const response = await apiClient.post('/admin/login', data)
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/admin/logout')
    return response.data
  },

  getDashboard: async () => {
    const response = await apiClient.get<AdminDashboardResponse>('/admin/dashboard')
    return response.data
  },
}

export default apiClient
