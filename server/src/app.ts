import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { taskRoutes } from './routes/tasks'
import { authRoutes } from './routes/auth'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// Middleware
app.use(helmet())
app.use(
  cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }),
)
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Error handler (must be last)
app.use(errorHandler)

export { app }
