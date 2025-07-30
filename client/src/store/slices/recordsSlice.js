import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { recordsService } from '../../services/recordsService'

export const fetchMyRecords = createAsyncThunk(
  'records/fetchMy',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await recordsService.getMyRecords(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createRecord = createAsyncThunk(
  'records/create',
  async (recordData, { rejectWithValue }) => {
    try {
      return await recordsService.createRecord(recordData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateRecord = createAsyncThunk(
  'records/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await recordsService.updateRecord(id, data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteRecord = createAsyncThunk(
  'records/delete',
  async (id, { rejectWithValue }) => {
    try {
      await recordsService.deleteRecord(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    myRecords: [],
    loading: false,
    error: null,
    stats: { total: 0, draft: 0, investigating: 0, resolved: 0, rejected: 0 },
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateStats: (state) => {
      const records = state.myRecords
      state.stats = {
        total: records.length,
        draft: records.filter(r => r.status === 'draft').length,
        investigating: records.filter(r => r.status === 'under investigation').length,
        resolved: records.filter(r => r.status === 'resolved').length,
        rejected: records.filter(r => r.status === 'rejected').length,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRecords.fulfilled, (state, action) => {
        state.myRecords = action.payload.records
        state.loading = false
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.myRecords.unshift(action.payload.record)
        state.loading = false
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        const index = state.myRecords.findIndex(r => r.id === action.payload.record.id)
        if (index !== -1) {
          state.myRecords[index] = action.payload.record
        }
        state.loading = false
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.myRecords = state.myRecords.filter(r => r.id !== action.payload)
        state.loading = false
      })
      .addMatcher(
        (action) => action.type.startsWith('records/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('records/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  },
})

export const { clearError, updateStats } = recordsSlice.actions
export default recordsSlice.reducer