import { post } from './index'

interface AuthResponse {
  token: string
  user: { id: string; nickname: string; phone: string }
}

export const login = (data: { phone: string }) =>
  post<AuthResponse>('/auth/login', data)

export const register = (data: { phone: string; nickname: string }) =>
  post<AuthResponse>('/auth/register', data)
