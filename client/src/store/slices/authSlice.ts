import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types/auth'
import * as authApi from '@/lib/api/auth'

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

// ─── Thunks ───

export const loginUser = createAsyncThunk<User, LoginCredentials>(
  'auth/login',
  async (credentials) => {
    const response = await authApi.loginUser(credentials)
    return response.user
  },
)

export const registerUser = createAsyncThunk<User, RegisterCredentials>(
  'auth/register',
  async (credentials) => {
    const response = await authApi.registerUser(credentials)
    return response.user
  },
)

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    await authApi.logoutUser()
  },
)

export const fetchCurrentUser = createAsyncThunk<User, void>(
  'auth/fetchCurrentUser',
  async () => {
    const response = await authApi.fetchCurrentUser()
    return response.user
  },
)

// ─── Slice ───

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to login'
    })

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Failed to register'
    })

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false
      state.user = null
      state.token = null
      state.error = null
    })
    builder.addCase(logoutUser.rejected, (state) => {
      // Clear user even if API fails
      state.loading = false
      state.user = null
      state.token = null
    })

    // Fetch current user (session restore)
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
      state.error = null
    })
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false
      state.user = null
      // Don't set error for 401 (expected when not authenticated)
      if (action.error.message && !action.error.message.includes('401')) {
        state.error = action.error.message
      }
    })
  },
})

export const { clearError } = authSlice.actions
export const authReducer = authSlice.reducer

// ─── Selectors ───

export const selectCurrentUser = (state: RootState): User | null => state.auth.user

export const selectIsAuthenticated = createSelector(
  [selectCurrentUser],
  (user) => user !== null,
)

export const selectAuthLoading = (state: RootState): boolean => state.auth.loading

export const selectAuthError = (state: RootState): string | null => state.auth.error
