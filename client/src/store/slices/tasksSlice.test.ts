import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import {
  tasksReducer,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  selectTasksByStatus,
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
} from './tasksSlice'
import { teamsReducer } from './teamsSlice'
import { authReducer } from './authSlice'
import type { Task, TasksState } from '@/types'

// ─── Mock api.ts ───
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  extractErrorMessage: vi.fn((e: unknown) =>
    e instanceof Error ? e.message : 'Unknown error',
  ),
}))

import { api } from '@/lib/api'

// ─── Helpers ───
function createTestStore(preloadedTasks?: Partial<TasksState>) {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      teams: teamsReducer,
      auth: authReducer,
    },
    preloadedState: {
      tasks: { tasks: [], loading: false, error: null, ...preloadedTasks },
      teams: { teams: [], currentTeamId: 'test-team-id', loading: false, error: null },
      auth: { user: null, token: null, loading: false, error: null },
    },
  })
}

function mockTask(overrides: Partial<Task> = {}): Task {
  return {
    _id: '1',
    title: 'Test Task',
    status: 'todo',
    order: 0,
    dueDate: '2026-06-01T00:00:00.000Z',
    teamId: 'test-team-id',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  }
}

// ═══════════════════════════════════════════════════════════════

describe('tasksSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── fetchTasks ───
  describe('fetchTasks', () => {
    it('populates state.tasks on fulfilled', async () => {
      const tasks = [mockTask({ _id: '1' }), mockTask({ _id: '2', title: 'Second' })]
      vi.mocked(api.get).mockResolvedValueOnce({ data: tasks })

      const store = createTestStore()
      await store.dispatch(fetchTasks())

      expect(store.getState().tasks.tasks).toEqual(tasks)
      expect(store.getState().tasks.loading).toBe(false)
      expect(store.getState().tasks.error).toBeNull()
    })

    it('sets error on rejected, tasks untouched', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const existing = [mockTask()]
      const store = createTestStore({ tasks: existing })
      await store.dispatch(fetchTasks())

      expect(store.getState().tasks.tasks).toEqual(existing)
      expect(store.getState().tasks.error).toBe('Network error')
      expect(store.getState().tasks.loading).toBe(false)
    })
  })

  // ─── createTask ───
  describe('createTask', () => {
    it('appends new task on fulfilled', async () => {
      const newTask = mockTask({ _id: '2', title: 'New Task' })
      vi.mocked(api.post).mockResolvedValueOnce({ data: newTask })

      const store = createTestStore({ tasks: [mockTask({ _id: '1' })] })
      await store.dispatch(
        createTask({
          title: 'New Task',
          status: 'todo',
          dueDate: '2026-06-01',
          teamId: 'test-team-id',
        }),
      )

      expect(store.getState().tasks.tasks).toHaveLength(2)
      expect(store.getState().tasks.tasks[1]).toEqual(newTask)
    })
  })

  // ─── updateTask ───
  describe('updateTask', () => {
    it('replaces task with server response on fulfilled', async () => {
      const updated = mockTask({ _id: '1', status: 'done', order: 0 })
      vi.mocked(api.patch).mockResolvedValueOnce({ data: updated })

      const store = createTestStore({ tasks: [mockTask({ _id: '1', status: 'todo' })] })
      await store.dispatch(updateTask({ id: '1', status: 'done' }))

      expect(store.getState().tasks.tasks[0].status).toBe('done')
      expect(store.getState().tasks.tasks[0]._prevStatus).toBeUndefined()
    })

    it('rolls back optimistic update on rejected', async () => {
      vi.mocked(api.patch).mockRejectedValueOnce(new Error('Server error'))

      const store = createTestStore({
        tasks: [mockTask({ _id: '1', status: 'todo', order: 0 })],
      })
      await store.dispatch(updateTask({ id: '1', status: 'done', order: 2 }))

      const task = store.getState().tasks.tasks[0]
      expect(task.status).toBe('todo') // rolled back
      expect(task.order).toBe(0) // rolled back
      expect(task._prevStatus).toBeUndefined()
      expect(store.getState().tasks.error).toBe('Server error')
    })
  })

  // ─── deleteTask ───
  describe('deleteTask', () => {
    it('removes task from state on fulfilled', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: {} })

      const store = createTestStore({
        tasks: [mockTask({ _id: '1' }), mockTask({ _id: '2' })],
      })
      await store.dispatch(deleteTask('1'))

      expect(store.getState().tasks.tasks).toHaveLength(1)
      expect(store.getState().tasks.tasks[0]._id).toBe('2')
    })
  })

  // ─── Selectors ───
  describe('selectors', () => {
    const state = {
      tasks: {
        tasks: [
          mockTask({ _id: '1', status: 'todo', order: 3 }),
          mockTask({ _id: '2', status: 'done', order: 1 }),
          mockTask({ _id: '3', status: 'todo', order: 1 }),
        ],
        loading: true,
        error: 'some error',
      },
    }

    it('selectTasksByStatus filters by status and sorts by order ascending', () => {
      const result = selectTasksByStatus('todo')(state)
      expect(result).toHaveLength(2)
      expect(result[0]._id).toBe('3') // order: 1 first
      expect(result[1]._id).toBe('1') // order: 3 second
    })

    it('selectTasksByStatus returns empty array for no matches', () => {
      const result = selectTasksByStatus('in-progress')(state)
      expect(result).toHaveLength(0)
    })

    it('selectAllTasks returns all tasks', () => {
      expect(selectAllTasks(state)).toHaveLength(3)
    })

    it('selectTasksLoading returns loading state', () => {
      expect(selectTasksLoading(state)).toBe(true)
    })

    it('selectTasksError returns error state', () => {
      expect(selectTasksError(state)).toBe('some error')
    })
  })
})
