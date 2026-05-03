import { createSlice } from '@reduxjs/toolkit'
import type { AuthState } from '@/types'

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

/**
 * Auth slice — placeholder for Step 2 (bonus).
 * State shape is defined now so the store slot exists.
 * Thunks (login, register, logout) will be added when bonus is implemented.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
})

export const authReducer = authSlice.reducer
