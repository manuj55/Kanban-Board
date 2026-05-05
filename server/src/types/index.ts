// ═══════════════════════════════════════════════════════════════
// Neura Kanban — Server TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════

export type TaskStatus = 'todo' | 'in-progress' | 'done'

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
