import type { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { verifyToken } from '../utils/jwt'
import { ApiError } from '../utils/ApiError'

/**
 * Middleware to require authentication via JWT in httpOnly cookie
 * Attaches user to req.user if valid
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Read token from cookie
    const token = req.cookies.auth_token

    if (!token) {
      throw ApiError.unauthorized('Authentication required')
    }

    // Verify and decode token
    let payload
    try {
      payload = verifyToken(token)
    } catch {
      throw ApiError.unauthorized('Invalid or expired token')
    }

    // Find user by ID from token payload
    const user = await User.findById(payload.userId)
    if (!user) {
      throw ApiError.unauthorized('User not found')
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
