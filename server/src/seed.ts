import mongoose from 'mongoose'
import { Task } from './models/Task'
import * as dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neura-kanban'

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Clear existing tasks
    await Task.deleteMany({})
    console.log('✓ Cleared existing tasks')

    // Seed tasks across all three columns
    const tasks = [
      // To Do
      { title: 'Design new dashboard', description: 'Create wireframes for the main dashboard', status: 'todo', order: 0, dueDate: new Date('2026-05-15') },
      { title: 'Review user feedback', description: '', status: 'todo', order: 1, dueDate: new Date('2026-05-12') },
      { title: 'Fix login bug', description: 'Users report session timeout issues', status: 'todo', order: 2, dueDate: new Date('2026-05-10') },
      { title: 'Write API documentation', description: 'Document all REST endpoints', status: 'todo', order: 3, dueDate: new Date('2026-05-20') },

      // In Progress
      { title: 'Implement drag-drop', description: 'Kanban board card movement', status: 'in-progress', order: 0, dueDate: new Date('2026-05-08') },
      { title: 'Database optimization', description: 'Index important queries', status: 'in-progress', order: 1, dueDate: new Date('2026-05-09') },
      { title: 'Update dependencies', description: 'Upgrade to latest versions', status: 'in-progress', order: 2, dueDate: new Date('2026-05-18') },

      // Done
      { title: 'Setup MongoDB', description: '', status: 'done', order: 0, dueDate: new Date('2026-05-01') },
      { title: 'Create API routes', description: '', status: 'done', order: 1, dueDate: new Date('2026-05-02') },
      { title: 'Initialize Redux store', description: '', status: 'done', order: 2, dueDate: new Date('2026-05-03') },
    ]

    await Task.insertMany(tasks)
    console.log('✓ Seeded 10 tasks')

    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB\n✅ Seed complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
