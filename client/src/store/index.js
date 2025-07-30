// src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import recordsSlice from './slices/recordsSlice'
import publicSlice from './slices/publicSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    records: recordsSlice,
    public: publicSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Remove the TypeScript type exports - they don't work in .js files
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

export default store