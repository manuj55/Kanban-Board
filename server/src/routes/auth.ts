import { Router } from 'express'
import type { Request, Response } from 'express'
import { User } from '../models/User'
import { ApiError } from '../utils/ApiError'
import { generateToken } from '../utils/jwt'
import { requireAuth } from '../middleware/auth'
import { validateRegister, validateLogin } from '../middleware/validation'
import type { RegisterBody, LoginBody, AuthResponse, UserResponse } from '../types'

const router = Router()

// Helper to format user response (exclude password)
function formatUserResponse(user: {
  _id: { toString(): string }
  email: string
  name: string
  createdAt: Date
}): UserResponse {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  }
}

// POST /api/auth/register — Create new user account
router.post('/', validateRegister, async (req: Request, res: Response) => {
  const { email, password, name } = req.body as RegisterBody

  // Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw ApiError.badRequest('Email already in use')
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name,
  })

  // Generate JWT and set httpOnly cookie
  const token = generateToken(user._id.toString())
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  const response: AuthResponse = {
    user: formatUserResponse(user),
    message: 'Account created',
  }

  res.status(201).json(response)
})

// POST /api/auth/login — Authenticate user
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginBody

  // Find user by email (case-insensitive)
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials')
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials')
  }

  // Generate JWT and set httpOnly cookie
  const token = generateToken(user._id.toString())
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  const response: AuthResponse = {
    user: formatUserResponse(user),
    message: 'Logged in',
  }

  res.json(response)
})

// POST /api/auth/logout — Clear auth cookie
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  res.json({ success: true, message: 'Logged out' })
})

// GET /api/auth/me — Get current authenticated user
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  // req.user is set by requireAuth middleware
  const user = req.user!

  const response = {
    user: formatUserResponse(user),
  }

  res.json(response)
})

export { router as authRoutes }
