import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import threeReducer from '../features/three/threeSlice'

export const store = configureStore({
  reducer: {
    threeStore: threeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
})
