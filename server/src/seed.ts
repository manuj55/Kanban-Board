import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from './config/db'
import { Task } from './models/Task'

const addDays = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const tasks = [
  {
    title: 'Design system tokens',
    description: 'Map DESIGN.md color palette and typography to Tailwind theme',
    status: 'done' as const,
    order: 0,
    dueDate: addDays(7),
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for lint, typecheck, and test on PR',
    status: 'done' as const,
    order: 1,
    dueDate: addDays(10),
  },
  {
    title: 'Implement user authentication',
    description: 'JWT-based auth with httpOnly cookies and bcrypt hashing',
    status: 'in-progress' as const,
    order: 0,
    dueDate: addDays(5),
  },
  {
    title: 'Build REST API endpoints',
    description: 'Express CRUD routes for tasks with express-validator',
    status: 'in-progress' as const,
    order: 1,
    dueDate: addDays(6),
  },
  {
    title: 'Create Kanban board UI',
    description: 'Three-column layout with task cards and status indicators',
    status: 'in-progress' as const,
    order: 2,
    dueDate: addDays(8),
  },
  {
    title: 'Add drag-and-drop sorting',
    description: 'DnD-kit integration for cross-column task movement',
    status: 'todo' as const,
    order: 0,
    dueDate: addDays(14),
  },
  {
    title: 'Write integration tests',
    description: 'Jest + Supertest for API routes, Vitest for Redux slices',
    status: 'todo' as const,
    order: 1,
    dueDate: addDays(12),
  },
  {
    title: 'Deploy to production',
    description: 'Docker compose for MongoDB + Express + Next.js deployment',
    status: 'todo' as const,
    order: 2,
    dueDate: addDays(21),
  },
]

const seed = async (): Promise<void> => {
  await connectDB()
  await Task.deleteMany({})
  await Task.insertMany(tasks)
  // eslint-disable-next-line no-console
  console.log('[seed] Inserted 8 tasks.')
  process.exit(0)
}

seed().catch((err: unknown) => {
  console.error('[seed] Failed:', err)
  process.exit(1)
})
