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

    // Create multiple users
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@neuraflow.com',
      password: 'demo123', // Will be hashed by pre-save hook
    })

    const manu = await User.create({
      name: 'Manu Janardhana',
      email: 'manu@neuraflow.com',
      password: 'manu123',
    })

    const veda = await User.create({
      name: 'Veda Kumar',
      email: 'veda@neuraflow.com',
      password: 'veda123',
    })

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@neuraflow.com',
      password: 'bob123',
    })

    console.log('✓ Created 4 users (Demo, Manu, Veda, Bob)')

    // Create teams with multiple members
    const engineeringTeam = await Team.create({
      name: 'Engineering',
      createdBy: demoUser._id,
      members: [
        {
          userId: demoUser._id,
          role: 'owner',
          joinedAt: new Date('2026-04-01'),
        },
        {
          userId: manu._id,
          role: 'member',
          joinedAt: new Date('2026-04-10'),
        },
        {
          userId: bob._id,
          role: 'member',
          joinedAt: new Date('2026-04-15'),
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
          joinedAt: new Date('2026-04-01'),
        },
        {
          userId: bob._id,
          role: 'member',
          joinedAt: new Date('2026-04-12'),
        },
        {
          userId: veda._id,
          role: 'member',
          joinedAt: new Date('2026-04-20'),
        },
      ],
    })

    const marketingTeam = await Team.create({
      name: 'Marketing',
      createdBy: manu._id,
      members: [
        {
          userId: manu._id,
          role: 'owner',
          joinedAt: new Date('2026-04-05'),
        },
        {
          userId: veda._id,
          role: 'member',
          joinedAt: new Date('2026-04-18'),
        },
      ],
    })

    console.log('✓ Created 3 teams with multiple members:')
    console.log('  - Engineering: Demo (owner), Manu, Bob')
    console.log('  - Design: Demo (owner), Bob, Veda')
    console.log('  - Marketing: Manu (owner), Veda')

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
      { title: 'Redesign landing page', description: 'Update hero section and CTAs', status: 'todo', order: 2, dueDate: new Date('2026-05-22'), teamId: designTeam._id },

      // In Progress
      { title: 'User research interviews', description: 'Conduct 5 user interviews', status: 'in-progress', order: 0, dueDate: new Date('2026-05-11'), teamId: designTeam._id },
      { title: 'Prototype new onboarding', description: 'Build interactive prototype', status: 'in-progress', order: 1, dueDate: new Date('2026-05-13'), teamId: designTeam._id },

      // Done
      { title: 'Design system audit', description: 'Review existing components', status: 'done', order: 0, dueDate: new Date('2026-05-04'), teamId: designTeam._id },
      { title: 'Icon library setup', description: 'Organize and document icons', status: 'done', order: 1, dueDate: new Date('2026-05-05'), teamId: designTeam._id },
    ]

    // Seed tasks for Marketing team
    const marketingTasks = [
      // To Do
      { title: 'Plan Q2 campaign', description: 'Outline marketing strategy for Q2', status: 'todo', order: 0, dueDate: new Date('2026-05-17'), teamId: marketingTeam._id },
      { title: 'Write blog post', description: 'Article about new features', status: 'todo', order: 1, dueDate: new Date('2026-05-19'), teamId: marketingTeam._id },
      { title: 'Update social media', description: 'Schedule posts for the month', status: 'todo', order: 2, dueDate: new Date('2026-05-21'), teamId: marketingTeam._id },

      // In Progress
      { title: 'Create email campaign', description: 'Newsletter for product launch', status: 'in-progress', order: 0, dueDate: new Date('2026-05-10'), teamId: marketingTeam._id },
      { title: 'Analyze metrics', description: 'Review Q1 performance data', status: 'in-progress', order: 1, dueDate: new Date('2026-05-12'), teamId: marketingTeam._id },

      // Done
      { title: 'Setup analytics', description: 'Configure Google Analytics', status: 'done', order: 0, dueDate: new Date('2026-05-02'), teamId: marketingTeam._id },
      { title: 'Launch landing page', description: 'Published new landing page', status: 'done', order: 1, dueDate: new Date('2026-05-03'), teamId: marketingTeam._id },
    ]

    await Task.insertMany([...engineeringTasks, ...designTasks, ...marketingTasks])
    console.log('✓ Seeded 27 tasks (10 Engineering, 7 Design, 7 Marketing)')

    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB\n✅ Seed complete!')
    console.log('\n📝 Login credentials:')
    console.log('   Demo User:  demo@neuraflow.com  / demo123   (Owner: Engineering, Design)')
    console.log('   Manu:       manu@neuraflow.com  / manu123   (Owner: Marketing | Member: Engineering)')
    console.log('   Bob:        bob@neuraflow.com   / bob123    (Member: Engineering, Design)')
    console.log('   Veda:       veda@neuraflow.com  / veda123   (Member: Design, Marketing)\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
