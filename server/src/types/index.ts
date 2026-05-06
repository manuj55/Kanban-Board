// ═══════════════════════════════════════════════════════════════
// Neura Kanban — Server TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════

export type TaskStatus = 'todo' | 'in-progress' | 'done'

// ─── Auth & User Types ───
export interface UserResponse {
  _id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthResponse {
  user: UserResponse
  message: string
}

export interface RegisterBody {
  email: string
  password: string
  name: string
}

export interface LoginBody {
  email: string
  password: string
}

// ─── API request body for creating a task ───
export interface CreateTaskBody {
  title: string
  description?: string
  dueDate: string // ISO 8601 string from client
  status?: TaskStatus
}

// ─── API request body for moving/updating a task ───
export interface UpdateTaskBody {
  status?: TaskStatus
  order?: number
  title?: string
  description?: string
  dueDate?: string
}

// ─── Standardized API error shape ───
export interface ApiErrorShape {
  success: false
  message: string
  stack?: string
}

// ─── Express Request extension for auth ───
import type { IUserDocument } from '../models/User'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUserDocument
    }
  }
}
