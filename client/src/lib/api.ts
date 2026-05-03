import axios, { isAxiosError } from 'axios'

/**
 * Configured axios instance — the ONLY file that imports axios.
 * All API calls go through Redux thunks → this module.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // pre-positioned for Step 2 httpOnly cookies
})

/**
 * Extract a human-readable error message from an unknown error.
 * Used by the response interceptor and available for thunks.
 */
export function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String((data as Record<string, unknown>).message)
    }
    return error.message || 'An unexpected error occurred'
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

// Response interceptor — normalize errors to Error objects with clean messages
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const message = extractErrorMessage(error)
    return Promise.reject(new Error(message))
  },
)

export { api }
