import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'

// ─── Interface: plain data shape (matches client Task interface) ───
export interface ITask {
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  order: number
  dueDate: Date
  teamId?: Types.ObjectId // optional now, required when bonus is built
}

// ─── Interface: Mongoose document (adds _id, timestamps, methods) ───
export interface ITaskDocument extends ITask, Document {
  createdAt: Date
  updatedAt: Date
}

// ─── Schema ───
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['todo', 'in-progress', 'done'],
        message: '{VALUE} is not a valid status',
      },
      default: 'todo',
    },
    order: {
      type: Number,
      required: true,
      min: [0, 'Order must be non-negative'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: false,
    },
  },
  { timestamps: true },
)

// Index for efficient column queries: tasks sorted by status then order
taskSchema.index({ status: 1, order: 1 })

export const Task = model<ITask>('Task', taskSchema)
