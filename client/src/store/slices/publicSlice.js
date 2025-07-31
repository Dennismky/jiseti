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
      urgency: 'all',
      search: '',
    },
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      // Merge new filters with existing ones
      state.filters = { ...state.filters, ...action.payload }
      // Reset pagination when filters change (except for page changes)
      if (!action.payload.page) {
        state.pagination.page = 1
      }
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearRecords: (state) => {
      state.records = []
      state.pagination = {
        page: 1,
        totalPages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false
      }
    },
    resetFilters: (state) => {
      state.filters = {
        status: 'all',
        type: 'all',
        urgency: 'all',
        search: '',
      }
      state.pagination.page = 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPublicRecords.fulfilled, (state, action) => {
        state.loading = false
        state.records = action.payload.records || []
        
        // Update pagination with backend response
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page || 1,
            totalPages: action.payload.pagination.pages || 1,
            total: action.payload.pagination.total || 0,
            hasNext: action.payload.pagination.has_next || false,
            hasPrev: action.payload.pagination.has_prev || false
          }
        }
      })
      .addCase(fetchPublicRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.records = []
      })
      .addCase(voteRecord.fulfilled, (state, action) => {
        // Update vote count for the specific record
        const recordIndex = state.records.findIndex(r => r.id === action.meta.arg.recordId)
        if (recordIndex !== -1) {
          state.records[recordIndex].vote_count = action.payload.vote_count || 0
        }
        
        // Also update selectedRecord if it's the same record
        if (state.selectedRecord && state.selectedRecord.id === action.meta.arg.recordId) {
          state.selectedRecord.vote_count = action.payload.vote_count || 0
        }
      })
      .addCase(voteRecord.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(submitAnonymousReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitAnonymousReport.fulfilled, (state, action) => {
        state.loading = false
        // Optionally add the new record to the list if it's public
        if (action.payload.record && action.payload.record.status !== 'draft') {
          state.records.unshift(action.payload.record)
        }
      })
      .addCase(submitAnonymousReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { 
  setFilters, 
  setSelectedRecord, 
  clearError, 
  clearRecords, 
  resetFilters 
} = publicSlice.actions

export default publicSlice.reducer