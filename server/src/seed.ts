import mongoose from 'mongoose'
import { Task } from './models/Task'
import { User } from './models/User'
import { Team } from './models/Team'
import * as dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neura-kanban'

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Clear existing data
    await Task.deleteMany({})
    await User.deleteMany({})
    await Team.deleteMany({})
    console.log('✓ Cleared existing data')

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@neuraflow.com',
      password: 'demo123', // Will be hashed by pre-save hook
    })
    console.log('✓ Created demo user (email: demo@neuraflow.com, password: demo123)')

    // Create teams
    const engineeringTeam = await Team.create({
      name: 'Engineering',
      createdBy: demoUser._id,
      members: [
        {
          userId: demoUser._id,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
    })

    const designTeam = await Team.create({
      name: 'Design',
      createdBy: demoUser._id,
      members: [
        {
          userId: demoUser._id,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
    })

    console.log('✓ Created 2 teams (Engineering, Design)')

    // Seed tasks for Engineering team
    const engineeringTasks = [
      // To Do
      { title: 'Design new dashboard', description: 'Create wireframes for the main dashboard', status: 'todo', order: 0, dueDate: new Date('2026-05-15'), teamId: engineeringTeam._id },
      { title: 'Review user feedback', description: 'Analyze latest user survey results', status: 'todo', order: 1, dueDate: new Date('2026-05-12'), teamId: engineeringTeam._id },
      { title: 'Fix login bug', description: 'Users report session timeout issues', status: 'todo', order: 2, dueDate: new Date('2026-05-10'), teamId: engineeringTeam._id },
      { title: 'Write API documentation', description: 'Document all REST endpoints', status: 'todo', order: 3, dueDate: new Date('2026-05-20'), teamId: engineeringTeam._id },

      // In Progress
      { title: 'Implement drag-drop', description: 'Kanban board card movement', status: 'in-progress', order: 0, dueDate: new Date('2026-05-08'), teamId: engineeringTeam._id },
      { title: 'Database optimization', description: 'Index important queries', status: 'in-progress', order: 1, dueDate: new Date('2026-05-09'), teamId: engineeringTeam._id },
      { title: 'Update dependencies', description: 'Upgrade to latest versions', status: 'in-progress', order: 2, dueDate: new Date('2026-05-18'), teamId: engineeringTeam._id },

      // Done
      { title: 'Setup MongoDB', description: 'Configure production database', status: 'done', order: 0, dueDate: new Date('2026-05-01'), teamId: engineeringTeam._id },
      { title: 'Create API routes', description: 'Build REST endpoints', status: 'done', order: 1, dueDate: new Date('2026-05-02'), teamId: engineeringTeam._id },
      { title: 'Initialize Redux store', description: 'Setup state management', status: 'done', order: 2, dueDate: new Date('2026-05-03'), teamId: engineeringTeam._id },
    ]

    // Seed tasks for Design team
    const designTasks = [
      // To Do
      { title: 'Create brand guidelines', description: 'Define colors, typography, and spacing', status: 'todo', order: 0, dueDate: new Date('2026-05-16'), teamId: designTeam._id },
      { title: 'Design mobile mockups', description: 'Create responsive layouts', status: 'todo', order: 1, dueDate: new Date('2026-05-14'), teamId: designTeam._id },

      // In Progress
      { title: 'User research interviews', description: 'Conduct 5 user interviews', status: 'in-progress', order: 0, dueDate: new Date('2026-05-11'), teamId: designTeam._id },
      { title: 'Prototype new onboarding', description: 'Build interactive prototype', status: 'in-progress', order: 1, dueDate: new Date('2026-05-13'), teamId: designTeam._id },

      // Done
      { title: 'Design system audit', description: 'Review existing components', status: 'done', order: 0, dueDate: new Date('2026-05-04'), teamId: designTeam._id },
      { title: 'Icon library setup', description: 'Organize and document icons', status: 'done', order: 1, dueDate: new Date('2026-05-05'), teamId: designTeam._id },
    ]

    await Task.insertMany([...engineeringTasks, ...designTasks])
    console.log('✓ Seeded 16 tasks (10 Engineering, 6 Design)')

    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB\n✅ Seed complete!')
    console.log('\n📝 Login credentials:')
    console.log('   Email: demo@neuraflow.com')
    console.log('   Password: demo123\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
