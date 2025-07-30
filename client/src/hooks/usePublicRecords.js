import { useSelector, useDispatch } from 'react-redux'
import { 
  fetchPublicRecords, 
  voteRecord, 
  setFilters, 
  setSelectedRecord 
} from '../store/slices/publicSlice'

export const usePublicRecords = () => {
  const dispatch = useDispatch()
  const { 
    records, 
    selectedRecord, 
    filters, 
    pagination, 
    loading, 
    error 
  } = useSelector(state => state.public)

  const loadRecords = (params = {}) => {
    const searchParams = { ...filters, ...params }
    dispatch(fetchPublicRecords(searchParams))
  }

  const vote = async (recordId, voteType) => {
    const result = await dispatch(voteRecord({ recordId, voteType }))
    return result
  }

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters))
  }

  const selectRecord = (record) => {
    dispatch(setSelectedRecord(record))
  }

  return {
    records,
    selectedRecord,
    filters,
    pagination,
    loading,
    error,
    loadRecords,
    vote,
    updateFilters,
    selectRecord,
  }
}