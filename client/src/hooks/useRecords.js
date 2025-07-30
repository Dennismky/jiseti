import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { 
  fetchMyRecords, 
  createRecord, 
  updateRecord, 
  deleteRecord, 
  updateStats 
} from '../store/slices/recordsSlice'

export const useRecords = () => {
  const dispatch = useDispatch()
  const { myRecords, loading, error, stats } = useSelector(state => state.records)

  useEffect(() => {
    dispatch(updateStats())
  }, [myRecords, dispatch])

  const loadRecords = (params) => {
    dispatch(fetchMyRecords(params))
  }

  const create = async (recordData) => {
    const result = await dispatch(createRecord(recordData))
    return result
  }

  const update = async (id, data) => {
    const result = await dispatch(updateRecord({ id, data }))
    return result
  }

  const remove = async (id) => {
    const result = await dispatch(deleteRecord(id))
    return result
  }

  return {
    records: myRecords,
    loading,
    error,
    stats,
    loadRecords,
    create,
    update,
    remove,
  }
}