import { post } from './index'

export interface AuthResponse {
  token: string
  dbToken?: string
  user: { id: string; nickname: string; phone: string }
}

export const login = (data: { phone: string; password: string }) =>
  post<AuthResponse>('/auth/login', data)

export const register = (data: { phone: string; password: string; nickname: string }) =>
  post<AuthResponse>('/auth/register', data)

export const verify = (data: { dbToken: string }) =>
  post<AuthResponse>('/auth/verify', data)
