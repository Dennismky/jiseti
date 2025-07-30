import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicService } from '../../services/publicService'

export const fetchPublicRecords = createAsyncThunk(
  'public/fetchRecords',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await publicService.getRecords(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const voteRecord = createAsyncThunk(
  'public/voteRecord',
  async ({ recordId, voteType }, { rejectWithValue }) => {
    try {
      return await publicService.voteRecord(recordId, voteType)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const submitAnonymousReport = createAsyncThunk(
  'public/submitAnonymousReport',
  async (reportData, { rejectWithValue }) => {
    try {
      return await publicService.submitAnonymousReport(reportData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const publicSlice = createSlice({
  name: 'public',
  initialState: {
    records: [],
    selectedRecord: null,
    filters: {
      status: 'all',
      type: 'all',
      search: '',
    },
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filtering
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublicRecords.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload.records
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPublicRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(voteRecord.fulfilled, (state, action) => {
        const recordIndex = state.records.findIndex(r => r.id === action.meta.arg.recordId)
        if (recordIndex !== -1) {
          state.records[recordIndex].vote_count = action.payload.vote_count
        }
      })
  },
})

export const { setFilters, setSelectedRecord, clearError } = publicSlice.actions
export default publicSlice.reducer