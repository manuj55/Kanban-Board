import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'

interface TokenPayload {
  userId: string
}

/**
 * Generate JWT token for user authentication
 */
export function generateToken(userId: string): string {
  const payload: TokenPayload = { userId }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify and decode JWT token
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}
