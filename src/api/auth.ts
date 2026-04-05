import { api } from './client'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    name: string
  }
}

export const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', input)
    return data
  },

  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', input)
    return data
  },

  refresh: async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
    const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}
