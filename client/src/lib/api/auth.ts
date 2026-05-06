import { api } from '../api'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from '@/types/auth'

/**
 * Auth API service layer
 * All auth-related HTTP calls go through this module
 */

interface ApiAuthResponse {
  user: {
    _id: string
    email: string
    name: string
    createdAt: string
  }
  message: string
}

interface ApiUserResponse {
  user: {
    _id: string
    email: string
    name: string
    createdAt: string
  }
}

// Normalize backend _id to client id
function normalizeUser(apiUser: {
  _id: string
  email: string
  name: string
  createdAt: string
}): User {
  return {
    id: apiUser._id,
    email: apiUser.email,
    name: apiUser.name,
    createdAt: apiUser.createdAt,
  }
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await api.post<ApiAuthResponse>(
    '/auth/login',
    credentials,
  )
  return {
    user: normalizeUser(response.data.user),
    message: response.data.message,
  }
}

export async function registerUser(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  const response = await api.post<ApiAuthResponse>(
    '/auth',
    credentials,
  )
  return {
    user: normalizeUser(response.data.user),
    message: response.data.message,
  }
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout')
}

export async function fetchCurrentUser(): Promise<{ user: User }> {
  const response = await api.get<ApiUserResponse>('/auth/me')
  return {
    user: normalizeUser(response.data.user),
  }
}
