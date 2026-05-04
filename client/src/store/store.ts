import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './slices/authSlice'
import { tasksReducer } from './slices/tasksSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
