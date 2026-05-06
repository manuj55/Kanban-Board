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
  teamId: string // required for team-scoped boards
  createdAt: string
  updatedAt: string
  // UI-only snapshot fields for optimistic update rollback (never sent to server)
  _prevStatus?: TaskStatus
  _prevOrder?: number
}

// ─── Form Input (what CreateTaskForm submits) ───
export interface CreateTaskInput {
  title: string
  status: TaskStatus
  description?: string
  dueDate: string
  teamId: string // required for team-scoped boards
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
// Auth & Team Types
// Defined in separate files for better organization.
// Import from client/src/types/auth.ts and client/src/types/team.ts
// ═══════════════════════════════════════════════════════════════

// Re-export for convenience
export type { User, AuthResponse, LoginCredentials, RegisterCredentials, AuthState } from './auth'
export type { TeamRole, TeamMember, Team, CreateTeamInput, AddMemberInput, TeamsState } from './team'
