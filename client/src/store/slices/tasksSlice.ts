import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, extractErrorMessage } from '@/lib/api'
import type { Task, TasksState, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types'

// ─── Initial State ───
const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
}

// ═══════════════════════════════════════════════════════════════
// Async Thunks — the ONLY place that imports and calls api.ts
// ═══════════════════════════════════════════════════════════════

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Task[]>('/tasks')
      return data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const createTask = createAsyncThunk<Task, CreateTaskInput, { rejectValue: string }>(
  'tasks/createTask',
  async (input, { rejectWithValue }) => {
    try {
      const { data } = await api.post<Task>('/tasks', input)
      return data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

export const updateTask = createAsyncThunk<
  Task,
  { id: string } & UpdateTaskInput,
  { rejectValue: string }
>('tasks/updateTask', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<Task>(`/tasks/${id}`, updates)
    return data
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error))
  }
})

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error))
    }
  },
)

// ═══════════════════════════════════════════════════════════════
// Slice
// ═══════════════════════════════════════════════════════════════

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ─── fetchTasks ───
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload
        state.loading = false
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch tasks'
        state.loading = false
      })

    // ─── createTask ───
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
        state.loading = false
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to create task'
        state.loading = false
      })

    // ─── updateTask (optimistic) ───
    builder
      .addCase(updateTask.pending, (state, action) => {
        const { id, status, order } = action.meta.arg
        const task = state.tasks.find((t) => t._id === id)
        if (task) {
          // Save snapshot on the task itself for rollback
          task._prevStatus = task.status
          task._prevOrder = task.order
          if (status !== undefined) task.status = status
          if (order !== undefined) task.order = order
        }
        state.loading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        // Replace with server truth, clean up snapshot fields
        const index = state.tasks.findIndex((t) => t._id === action.payload._id)
        if (index !== -1) state.tasks[index] = action.payload
        state.loading = false
      })
      .addCase(updateTask.rejected, (state, action) => {
        // Rollback to snapshot
        const { id } = action.meta.arg
        const task = state.tasks.find((t) => t._id === id)
        if (task && task._prevStatus !== undefined) {
          task.status = task._prevStatus
          task.order = task._prevOrder ?? task.order
          delete task._prevStatus
          delete task._prevOrder
        }
        state.error = action.payload ?? 'Failed to update task'
        state.loading = false
      })

    // ─── deleteTask ───
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload)
        state.loading = false
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete task'
        state.loading = false
      })
  },
})

export const tasksReducer = tasksSlice.reducer

// ═══════════════════════════════════════════════════════════════
// Selectors
// Uses { tasks: TasksState } instead of RootState to avoid
// circular imports between slice → store → slice.
// ═══════════════════════════════════════════════════════════════

/** Select tasks for a specific column, sorted by order ascending */
export const selectTasksByStatus =
  (status: TaskStatus) =>
  (state: { tasks: TasksState }): Task[] =>
    state.tasks.tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.order - b.order)

export const selectAllTasks = (state: { tasks: TasksState }) => state.tasks.tasks
export const selectTasksLoading = (state: { tasks: TasksState }) => state.tasks.loading
export const selectTasksError = (state: { tasks: TasksState }) => state.tasks.error
