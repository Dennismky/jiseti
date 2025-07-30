import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    modals: {
      createRecord: false,
      editRecord: false,
      recordDetails: false,
      anonymousReport: false,
    },
    loading: {
      global: false,
      records: false,
      auth: false,
    },
    theme: 'light',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
    setLoading: (state, action) => {
      const { type, value } = action.payload
      state.loading[type] = value
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})

export const { toggleSidebar, openModal, closeModal, setLoading, toggleTheme } = uiSlice.actions
export default uiSlice.reducer