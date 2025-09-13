import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import knowledgeSlice from './slices/knowledgeSlice'
import progressSlice from './slices/progressSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    knowledge: knowledgeSlice,
    progress: progressSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch