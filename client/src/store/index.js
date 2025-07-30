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


export default store