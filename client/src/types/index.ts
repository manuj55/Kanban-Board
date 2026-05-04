// ═══════════════════════════════════════════════════════════════
// Neura Kanban — Client TypeScript Interfaces
// Single source of truth for ALL client-side types.
// ═══════════════════════════════════════════════════════════════

// ─── Task Status ───
export type TaskStatus = 'todo' | 'in-progress' | 'done'

// ─── Task (matches MongoDB document, _id serialized to string) ───
export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  order: number
  dueDate: string // ISO 8601 string (serializable for Redux)
  teamId?: string // optional now, required when bonus is built
  createdAt: string
  updatedAt: string
  // UI-only snapshot fields for optimistic update rollback (never sent to server)
  _prevStatus?: TaskStatus
  _prevOrder?: number
}

// ─── Form Input (what CreateTaskForm submits) ───
export interface CreateTaskInput {
  title: string
  description?: string
  dueDate: string
}

// ─── Update/Move Input (drag-drop, dropdown, and edit) ───
export interface UpdateTaskInput {
  status?: TaskStatus
  order?: number
}

// ─── Redux: Tasks State ───
export interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

// ═══════════════════════════════════════════════════════════════
// Bonus-ready types (Step 2 — auth + teams)
// Defined now to avoid future refactoring.
// ═══════════════════════════════════════════════════════════════

// ─── User ───
export interface User {
  _id: string
  name: string
  email: string
  teams: string[]
}

// ─── Team ───
export interface Team {
  _id: string
  name: string
  members: User[]
  createdBy: string
}

// ─── Redux: Auth State ───
export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// ─── Auth API Response ───
export interface AuthResponse {
  token: string
  user: User
}
