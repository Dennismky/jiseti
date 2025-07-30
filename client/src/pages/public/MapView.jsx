import { useEffect } from 'react'
import { usePublicRecords } from '../../hooks/usePublicRecords'
import RecordsMap from '../../components/maps/RecordsMap'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const MapView = () => {
  const { records, loading, error, loadRecords, selectRecord } = usePublicRecords()

  useEffect(() => {
    loadRecords()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading map data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage message={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <RecordsMap
        records={records}
        onRecordSelect={selectRecord}
        className="w-full h-full"
      />
    </div>
  )
}

export default MapView