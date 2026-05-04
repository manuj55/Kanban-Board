import request from 'supertest'
import { app } from '../app'
import { Task } from '../models/Task'

// ─── Mock Mongoose Task model ───
jest.mock('../models/Task', () => ({
  Task: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
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
  it('returns 200 with updated task', async () => {
    const updated = { ...mockTask, status: 'done' }
    ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated)

    const res = await request(app)
      .patch(`/api/tasks/${VALID_ID}`)
      .send({ status: 'done' })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('done')
  })

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

  it('returns 404 when task not found', async () => {
    ;(Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null)

    const res = await request(app)
      .patch(`/api/tasks/${VALID_ID}`)
      .send({ status: 'done' })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Task not found')
  })
})

describe('DELETE /api/tasks/:id', () => {
  it('returns 200 with deleted task id', async () => {
    ;(Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTask)

    const res = await request(app).delete(`/api/tasks/${VALID_ID}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true, id: VALID_ID })
  })

  it('returns 404 when task not found', async () => {
    ;(Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null)

    const res = await request(app).delete(`/api/tasks/${VALID_ID}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Task not found')
  })
})
