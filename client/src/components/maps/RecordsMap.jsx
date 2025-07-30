import { useState, useEffect } from 'react'
import { Filter, Layers } from 'lucide-react'
import GoogleMapContainer from './GoogleMapContainer'
import { RECORD_STATUS, RECORD_TYPES } from '../../constants'

const RecordsMap = ({ records = [], onRecordSelect, className = '' }) => {
  const [filteredRecords, setFilteredRecords] = useState(records)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all'
  })

  useEffect(() => {
    let filtered = records

    if (filters.status !== 'all') {
      filtered = filtered.filter(record => record.status === filters.status)
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(record => record.type === filters.type)
    }

    setFilteredRecords(filtered)
  }, [records, filters])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getMapCenter = () => {
    if (filteredRecords.length === 0) {
      return { lat: -1.2921, lng: 36.8219 } // Nairobi default
    }

    const validRecords = filteredRecords.filter(r => r.latitude && r.longitude)
    if (validRecords.length === 0) {
      return { lat: -1.2921, lng: 36.8219 }
    }

    const avgLat = validRecords.reduce((sum, r) => sum + parseFloat(r.latitude), 0) / validRecords.length
    const avgLng = validRecords.reduce((sum, r) => sum + parseFloat(r.longitude), 0) / validRecords.length

    return { lat: avgLat, lng: avgLng }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border p-4 max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Map Filters</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Status</option>
                <option value={RECORD_STATUS.INVESTIGATING}>Under Investigation</option>
                <option value={RECORD_STATUS.RESOLVED}>Resolved</option>
                <option value={RECORD_STATUS.REJECTED}>Rejected</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Types</option>
                <option value={RECORD_TYPES.RED_FLAG}>Red Flag</option>
                <option value={RECORD_TYPES.INTERVENTION}>Intervention</option>
                <option value={RECORD_TYPES.INCIDENT}>Incident</option>
                <option value={RECORD_TYPES.EMERGENCY}>Emergency</option>
              </select>
            </div>
          </div>
        )}

        {/* Records Count */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Layers className="w-4 h-4" />
            <span>{filteredRecords.length} records shown</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <GoogleMapContainer
        records={filteredRecords}
        center={getMapCenter()}
        zoom={10}
        showMarkers={true}
      />
    </div>
  )
}

export default RecordsMap