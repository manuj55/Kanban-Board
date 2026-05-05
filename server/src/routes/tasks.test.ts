import request from 'supertest'
import { app } from '../app'
import { Task } from '../models/Task'

// ─── Mock Mongoose Task model ───
jest.mock('../models/Task', () => ({
  Task: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    updateOne: jest.fn(),
  },
}))

const VALID_ID = '507f1f77bcf86cd799439011'

const mockTask = {
  _id: VALID_ID,
  title: 'Test Task',
  description: '',
  status: 'todo',
  order: 0,
  dueDate: '2026-06-01T00:00:00.000Z',
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ═══════════════════════════════════════════════════════════════

describe('GET /api/tasks', () => {
  it('returns 200 with sorted tasks', async () => {
    ;(Task.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([mockTask]),
    })

    const res = await request(app).get('/api/tasks')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('Test Task')
    expect(Task.find).toHaveBeenCalledWith({})
  })
})

describe('POST /api/tasks', () => {
  it('returns 201 with created task', async () => {
    ;(Task.countDocuments as jest.Mock).mockResolvedValue(2)
    ;(Task.create as jest.Mock).mockResolvedValue({
      ...mockTask,
      order: 2,
    })

    const res = await request(app).post('/api/tasks').send({
      title: 'New Task',
      dueDate: '2026-07-01T00:00:00.000Z',
    })

    expect(res.status).toBe(201)
    expect(res.body.order).toBe(2)
    expect(Task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        status: 'todo',
        order: 2,
      }),
    )
  })

  it('returns 400 when title is empty', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: '',
      dueDate: '2026-07-01T00:00:00.000Z',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Title is required')
  })

  it('returns 400 when dueDate is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Valid Title',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Due date is required')
  })
})

describe('PATCH /api/tasks/:id', () => {
  describe('Simple field updates (no column change)', () => {
    it('returns 200 with updated task when only updating title', async () => {
      const currentTask = { ...mockTask, status: 'todo', order: 1 }
      const updated = { ...currentTask, title: 'Updated Title' }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated)

      const res = await request(app)
        .patch(`/api/tasks/${VALID_ID}`)
        .send({ title: 'Updated Title' })

      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Updated Title')
      expect(Task.updateOne).not.toHaveBeenCalled() // No reordering
    })

    it('returns 200 with updated task when only updating description', async () => {
      const currentTask = { ...mockTask, status: 'in-progress', order: 2 }
      const updated = { ...currentTask, description: 'New description' }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated)

      const res = await request(app)
        .patch(`/api/tasks/${VALID_ID}`)
        .send({ description: 'New description' })

      expect(res.status).toBe(200)
      expect(res.body.description).toBe('New description')
      expect(Task.updateOne).not.toHaveBeenCalled() // No reordering
    })

    it('returns 200 with updated task when only updating dueDate', async () => {
      const currentTask = { ...mockTask, status: 'done', order: 0 }
      const updated = { ...currentTask, dueDate: '2026-08-01T00:00:00.000Z' }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated)

      const res = await request(app)
        .patch(`/api/tasks/${VALID_ID}`)
        .send({ dueDate: '2026-08-01T00:00:00.000Z' })

      expect(res.status).toBe(200)
      expect(Task.updateOne).not.toHaveBeenCalled() // No reordering
    })
  })

  describe('Column change with complex reordering', () => {
    it('moves task to new column and reindexes both source and target columns', async () => {
      const taskId = '507f1f77bcf86cd799439012'

      // Current task in "todo" column at position 2
      const currentTask = {
        _id: taskId,
        title: 'Task to move',
        status: 'todo',
        order: 2,
      }

      // Target column (in-progress) has 3 tasks
      const targetColumnTasks = [
        { _id: 'target1', status: 'in-progress', order: 0 },
        { _id: 'target2', status: 'in-progress', order: 1 },
        { _id: 'target3', status: 'in-progress', order: 2 },
      ]

      // Source column (todo) has 2 remaining tasks after current task is excluded
      const sourceColumnTasks = [
        { _id: 'source1', status: 'todo', order: 0 },
        { _id: 'source2', status: 'todo', order: 1 },
      ]

      const updatedTask = { ...currentTask, status: 'in-progress', order: 1 }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)

      // Mock find() to return chainable sort() for target column
      const targetFind = { sort: jest.fn().mockResolvedValue(targetColumnTasks) }
      // Mock find() to return chainable sort() for source column
      const sourceFind = { sort: jest.fn().mockResolvedValue(sourceColumnTasks) }

      ;(Task.find as jest.Mock)
        .mockReturnValueOnce(targetFind) // First call for target column
        .mockReturnValueOnce(sourceFind) // Second call for source column

      ;(Task.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 })
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask)

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'in-progress', order: 1 })

      expect(res.status).toBe(200)
      expect(res.body.status).toBe('in-progress')
      expect(res.body.order).toBe(1)

      // Verify target column reindexing: tasks at/after insertion point shifted
      expect(Task.updateOne).toHaveBeenCalledWith(
        { _id: 'target2' },
        { order: 2 }
      )
      expect(Task.updateOne).toHaveBeenCalledWith(
        { _id: 'target3' },
        { order: 3 }
      )

      // Verify source column reindexing: gaps closed
      expect(Task.updateOne).toHaveBeenCalledWith(
        { _id: 'source1' },
        { order: 0 }
      )
      expect(Task.updateOne).toHaveBeenCalledWith(
        { _id: 'source2' },
        { order: 1 }
      )

      // Verify task updated with new status and order
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        expect.objectContaining({
          status: 'in-progress',
          order: 1,
        }),
        { new: true, runValidators: true }
      )
    })

    it('inserts task at beginning of target column (order: 0)', async () => {
      const taskId = '507f1f77bcf86cd799439013'

      const currentTask = {
        _id: taskId,
        status: 'in-progress',
        order: 1,
      }

      const targetColumnTasks = [
        { _id: 'target1', status: 'done', order: 0 },
        { _id: 'target2', status: 'done', order: 1 },
      ]

      const sourceColumnTasks = [
        { _id: 'source1', status: 'in-progress', order: 0 },
      ]

      const updatedTask = { ...currentTask, status: 'done', order: 0 }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)

      const targetFind = { sort: jest.fn().mockResolvedValue(targetColumnTasks) }
      const sourceFind = { sort: jest.fn().mockResolvedValue(sourceColumnTasks) }

      ;(Task.find as jest.Mock)
        .mockReturnValueOnce(targetFind)
        .mockReturnValueOnce(sourceFind)

      ;(Task.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 })
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask)

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'done', order: 0 })

      expect(res.status).toBe(200)

      // All target column tasks should shift down
      expect(Task.updateOne).toHaveBeenCalledWith(
        { _id: 'target1' },
        { order: 1 }
      )
      expect(Task.updateOne).toHaveBeenCalledWith(
        { _id: 'target2' },
        { order: 2 }
      )
    })

    it('appends task to end of target column when order not provided', async () => {
      const taskId = '507f1f77bcf86cd799439014'

      const currentTask = {
        _id: taskId,
        status: 'todo',
        order: 0,
      }

      const targetColumnTasks = [
        { _id: 'target1', status: 'done', order: 0 },
        { _id: 'target2', status: 'done', order: 1 },
      ]

      const sourceColumnTasks: never[] = []

      const updatedTask = { ...currentTask, status: 'done', order: 2 }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)

      const targetFind = { sort: jest.fn().mockResolvedValue(targetColumnTasks) }
      const sourceFind = { sort: jest.fn().mockResolvedValue(sourceColumnTasks) }

      ;(Task.find as jest.Mock)
        .mockReturnValueOnce(targetFind)
        .mockReturnValueOnce(sourceFind)

      ;(Task.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 })
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask)

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'done' }) // No order specified

      expect(res.status).toBe(200)

      // Task should be appended to end (order: 2)
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        expect.objectContaining({
          status: 'done',
          order: 2,
        }),
        { new: true, runValidators: true }
      )
    })

    it('updates other fields during column change', async () => {
      const taskId = '507f1f77bcf86cd799439015'

      const currentTask = {
        _id: taskId,
        title: 'Old Title',
        description: 'Old Description',
        status: 'todo',
        order: 0,
        dueDate: '2026-05-15T00:00:00.000Z',
      }

      const targetColumnTasks: never[] = []
      const sourceColumnTasks: never[] = []

      const updatedTask = {
        _id: taskId,
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'in-progress',
        order: 0,
        dueDate: '2026-06-01T00:00:00.000Z',
      }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)

      const targetFind = { sort: jest.fn().mockResolvedValue(targetColumnTasks) }
      const sourceFind = { sort: jest.fn().mockResolvedValue(sourceColumnTasks) }

      ;(Task.find as jest.Mock)
        .mockReturnValueOnce(targetFind)
        .mockReturnValueOnce(sourceFind)

      ;(Task.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 })
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask)

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({
          status: 'in-progress',
          order: 0,
          title: 'Updated Title',
          description: 'Updated Description',
          dueDate: '2026-06-01T00:00:00.000Z',
        })

      expect(res.status).toBe(200)

      // Verify all fields updated
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        expect.objectContaining({
          status: 'in-progress',
          order: 0,
          title: 'Updated Title',
          description: 'Updated Description',
        }),
        { new: true, runValidators: true }
      )
    })
  })

  describe('Validation and error cases', () => {
    it('returns 400 with invalid status', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${VALID_ID}`)
        .send({ status: 'invalid' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Status must be todo, in-progress, or done')
    })

    it('returns 400 with invalid ObjectId', async () => {
      const res = await request(app)
        .patch('/api/tasks/not-a-valid-id')
        .send({ status: 'done' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Invalid task ID')
    })

    it('returns 404 when task not found (initial lookup)', async () => {
      ;(Task.findById as jest.Mock).mockResolvedValue(null)

      const res = await request(app)
        .patch(`/api/tasks/${VALID_ID}`)
        .send({ status: 'done' })

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Task not found')
    })

    it('returns 404 when task not found (after simple update)', async () => {
      const currentTask = { ...mockTask, status: 'todo', order: 1 }

      ;(Task.findById as jest.Mock).mockResolvedValue(currentTask)
      ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null)

      const res = await request(app)
        .patch(`/api/tasks/${VALID_ID}`)
        .send({ title: 'Updated Title' })

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Task not found')
    })
  })
})

describe('DELETE /api/tasks/:id', () => {
  it('returns 200 with deleted task id and reindexes remaining tasks in column', async () => {
    const deletedTask = {
      _id: VALID_ID,
      title: 'Task to delete',
      status: 'in-progress',
      order: 1,
    }

    // Remaining tasks in the same column after deletion
    const remainingTasks = [
      { _id: 'task1', status: 'in-progress', order: 0 },
      { _id: 'task2', status: 'in-progress', order: 2 },
      { _id: 'task3', status: 'in-progress', order: 3 },
    ]

    ;(Task.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedTask)

    const mockFind = {
      sort: jest.fn().mockResolvedValue(remainingTasks),
    }
    ;(Task.find as jest.Mock).mockReturnValue(mockFind)
    ;(Task.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 })

    const res = await request(app).delete(`/api/tasks/${VALID_ID}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true, id: VALID_ID })

    // Verify remaining tasks reindexed to 0, 1, 2
    expect(Task.updateOne).toHaveBeenCalledWith(
      { _id: 'task1' },
      { order: 0 }
    )
    expect(Task.updateOne).toHaveBeenCalledWith(
      { _id: 'task2' },
      { order: 1 }
    )
    expect(Task.updateOne).toHaveBeenCalledWith(
      { _id: 'task3' },
      { order: 2 }
    )
  })

  it('deletes task successfully when it is the only task in column', async () => {
    const deletedTask = {
      _id: VALID_ID,
      status: 'done',
      order: 0,
    }

    ;(Task.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedTask)

    const mockFind = {
      sort: jest.fn().mockResolvedValue([]), // No remaining tasks
    }
    ;(Task.find as jest.Mock).mockReturnValue(mockFind)

    const res = await request(app).delete(`/api/tasks/${VALID_ID}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true, id: VALID_ID })
    expect(Task.updateOne).not.toHaveBeenCalled() // No tasks to reindex
  })

  it('returns 404 when task not found', async () => {
    ;(Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null)

    const res = await request(app).delete(`/api/tasks/${VALID_ID}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Task not found')
  })

  it('returns 400 with invalid ObjectId', async () => {
    const res = await request(app).delete('/api/tasks/not-a-valid-id')

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid task ID')
  })
})
