import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/authSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      // tasks: tasksReducer, // Added in next step
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
