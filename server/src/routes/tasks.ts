import { Router } from 'express'
import type { Request, Response } from 'express'
import { Task } from '../models/Task'
import { ApiError } from '../utils/ApiError'
import type { CreateTaskBody, UpdateTaskBody } from '../types'
import {
  validateCreateTask,
  validateUpdateTask,
  validateObjectId,
} from '../middleware/validation'

const router = Router()

// GET / — fetch all tasks sorted by order ascending
router.get('/', async (_req: Request, res: Response) => {
  const tasks = await Task.find({}).sort({ order: 1 })
  res.json(tasks)
})

// POST / — create task (always 'todo', order = bottom of column)
router.post('/', validateCreateTask, async (req: Request, res: Response) => {
  const { title, description, dueDate } = req.body as CreateTaskBody
  const order = await Task.countDocuments({ status: 'todo' })
  const task = await Task.create({
    title,
    description: description || '',
    status: 'todo',
    order,
    dueDate: new Date(dueDate),
  })
  res.status(201).json(task)
})

// PATCH /:id — update task fields with reordering logic
router.patch(
  '/:id',
  [...validateObjectId, ...validateUpdateTask],
  async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body as UpdateTaskBody

    // Fetch current task to detect column change
    const currentTask = await Task.findById(id)
    if (!currentTask) throw ApiError.notFound('Task not found')

    const isColumnChange = body.status !== undefined && body.status !== currentTask.status
    const oldStatus = currentTask.status
    const newStatus = body.status || currentTask.status

    // If moving to new column, reindex both source and target
    if (isColumnChange) {
      // Get all tasks in target column (excluding this task)
      const targetColumnTasks = await Task.find({
        status: newStatus,
        _id: { $ne: id },
      }).sort({ order: 1 })

      // Determine insertion point (use provided order or append to end)
      const insertionIndex = body.order ?? targetColumnTasks.length
      const targetOrder = Math.max(0, Math.min(insertionIndex, targetColumnTasks.length))

      // Reindex target column: shift all tasks at/after insertion point
      for (let i = targetOrder; i < targetColumnTasks.length; i++) {
        await Task.updateOne(
          { _id: targetColumnTasks[i]._id },
          { order: i + 1 },
        )
      }

      // Reindex source column: remove gap
      const sourceColumnTasks = await Task.find({
        status: oldStatus,
        _id: { $ne: id },
      }).sort({ order: 1 })

      for (let i = 0; i < sourceColumnTasks.length; i++) {
        await Task.updateOne(
          { _id: sourceColumnTasks[i]._id },
          { order: i },
        )
      }

      // Update task with new status and order
      const updates: Record<string, unknown> = { status: newStatus, order: targetOrder }
      if (body.title !== undefined) updates.title = body.title
      if (body.description !== undefined) updates.description = body.description
      if (body.dueDate !== undefined) updates.dueDate = new Date(body.dueDate)

      const updatedTask = await Task.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })

      return res.json(updatedTask)
    }

    // If not moving columns, just update fields
    const updates: Record<string, unknown> = {}
    if (body.status !== undefined) updates.status = body.status
    if (body.order !== undefined) updates.order = body.order
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.dueDate !== undefined) updates.dueDate = new Date(body.dueDate)

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!task) throw ApiError.notFound('Task not found')
    res.json(task)
  },
)

// DELETE /:id — delete task and reindex column
router.delete(
  '/:id',
  validateObjectId,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const task = await Task.findByIdAndDelete(id)
    if (!task) throw ApiError.notFound('Task not found')

    // Reindex remaining tasks in the deleted task's column
    const remainingTasks = await Task.find({
      status: task.status,
    }).sort({ order: 1 })

    for (let i = 0; i < remainingTasks.length; i++) {
      await Task.updateOne(
        { _id: remainingTasks[i]._id },
        { order: i },
      )
    }

    res.json({ success: true, id })
  },
)

export { router as taskRoutes }
