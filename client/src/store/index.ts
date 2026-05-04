// Store
export { makeStore } from './store'
export type { AppStore, RootState, AppDispatch } from './store'

// Hooks
export { useAppDispatch, useAppSelector } from './hooks'

// Tasks
export {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  tasksReducer,
  selectTasksByStatus,
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from './slices/tasksSlice'

// Auth (placeholder)
export { authReducer } from './slices/authSlice'
