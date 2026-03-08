import axios from 'axios'
import type { TicketResponse } from './schemas'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

type ApiErrorPayload = {
  message?: string
  errors?: Array<{ message?: string }>
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined

    if (payload?.message && payload.message.trim()) {
      return payload.message
    }

    const firstFieldError = payload?.errors?.find((item) => item?.message?.trim())?.message
    if (firstFieldError) {
      return firstFieldError
    }

    if (error.message?.trim()) {
      return error.message
    }
  }

  return fallback
}

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
type ApiSuccessResponse = {
  success: boolean
  message?: string
}

type CreateTicketRequest = {
  title: string
  description: string
  category: string
  priority?: 'low' | 'medium' | 'high'
  deadline?: Date
  relatedSkills?: string[]
  helpfulNotes?: string
  isPublic?: boolean
}

type CreateTicketResponse = ApiSuccessResponse & {
  ticket: TicketResponse
}

type SearchSimilarTicketsRequest = {
  title: string
  description: string
  category?: string
  limit?: number
}

type SearchSimilarTicketsResponse = ApiSuccessResponse & {
  tickets: TicketResponse[]
}

type UpdateTicketRequest = {
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
}

type UpdateTicketResponse = ApiSuccessResponse & {
  ticket?: TicketResponse
}

type GetMyTicketsResponse = ApiSuccessResponse & {
  tickets: TicketResponse[]
}

type TicketSummary = {
  totalTickets: number
  inProgress: number
  completed: number
}

type GetTicketStatsResponse = ApiSuccessResponse & {
  summary: TicketSummary
  previousSummary: TicketSummary
  tickets: Array<{
    id: number
    title: string
    assignedTo: number | null
    priority: 'low' | 'medium' | 'high'
    createdAt: string
    status: 'pending' | 'in_progress' | 'completed'
    relatedSkills: string[]
  }>
}

type DeleteTicketResponse = ApiSuccessResponse

type ToggleTicketStatusResponse = ApiSuccessResponse & {
  ticket: TicketResponse
}

type TicketReplyRequest = {
  ticketId: number
  message: string
}

type TicketReplyResponse = ApiSuccessResponse & {
  ticket: TicketResponse
}

type PublicCompletedTicketsFilters = {
  category?: string
  skills?: string[]
}

type PublicCompletedTicketsResponse = ApiSuccessResponse & {
  tickets: TicketResponse[]
}

export const ticketApi = {
  getMyTickets: async (): Promise<GetMyTicketsResponse> => {
    const response = await apiClient.get<GetMyTicketsResponse>('/tickets')
    return response.data
  },

  getTicketStats: async (): Promise<GetTicketStatsResponse> => {
    const response = await apiClient.get<GetTicketStatsResponse>('/tickets/tickets-summary')
    return response.data
  },

  getAssignedTickets: async (): Promise<GetMyTicketsResponse> => {
    const response = await apiClient.get<GetMyTicketsResponse>('/tickets/get-assigned')
    return response.data
  },

  getPublicCompletedTickets: async (
    filters?: PublicCompletedTicketsFilters,
  ): Promise<PublicCompletedTicketsResponse> => {
    const params = new URLSearchParams()

    if (filters?.category) {
      params.set('category', filters.category)
    }

    if (filters?.skills && filters.skills.length > 0) {
      params.set('skills', filters.skills.join(','))
    }

    const queryString = params.toString()
    const endpoint = queryString
      ? `/tickets/public-completed?${queryString}`
      : '/tickets/public-completed'

    const response = await apiClient.get<PublicCompletedTicketsResponse>(endpoint)
    return response.data
  },

  createTicket: async (data: CreateTicketRequest): Promise<CreateTicketResponse> => {
    const response = await apiClient.post<CreateTicketResponse>('/tickets', data)
    return response.data
  },

  searchSimilarTickets: async (
    data: SearchSimilarTicketsRequest,
  ): Promise<SearchSimilarTicketsResponse> => {
    const response = await apiClient.post<SearchSimilarTicketsResponse>('/tickets/similar', data)
    return response.data
  },

  getTicketById: async (ticketId: number) => {
    const response = await apiClient.get(`/tickets/${ticketId}`)
    return response.data
  },

  updateTicket: async (data: UpdateTicketRequest): Promise<UpdateTicketResponse> => {
    const { ticketId, ...updateData } = data
    const response = await apiClient.put<UpdateTicketResponse>('/tickets/edit-ticket', {
      ticketId,
      ...updateData,
    })
    return response.data
  },

  markTicketCompleted: async (ticketId: number): Promise<ToggleTicketStatusResponse> => {
    const response = await apiClient.put<ToggleTicketStatusResponse>(`/tickets/status/${ticketId}`)
    return response.data
  },

  replyToTicket: async (data: TicketReplyRequest): Promise<TicketReplyResponse> => {
    const response = await apiClient.put<TicketReplyResponse>('/tickets/ticket-reply', data)
    return response.data
  },

  deleteTicket: async (ticketId: number): Promise<DeleteTicketResponse> => {
    const response = await apiClient.delete<DeleteTicketResponse>('/tickets/delete-ticket', {
      data: { ticketId },
    })
    return response.data
  },
}

export default apiClient
