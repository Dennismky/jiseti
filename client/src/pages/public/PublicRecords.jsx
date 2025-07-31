import { useEffect, useState, useCallback, useMemo } from 'react'
import { usePublicRecords } from '../../hooks/usePublicRecords'
import { useAuth } from '../../hooks/useAuth'
import RecordCard from '../../components/records/RecordCard'
import RecordFilters from '../../components/records/RecordFilters'
import RecordDetailsModal from '../../components/records/RecordDetailsModal'
import RecordsMap from '../../components/maps/RecordsMap'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { Map, Search, Filter, List } from 'lucide-react'
import { debounce } from 'lodash'

const PublicRecords = () => {
  const { isAuthenticated } = useAuth()
  const { 
    records, 
    selectedRecord, 
    filters, 
    pagination, 
    loading, 
    error, 
    loadRecords, 
    vote, 
    updateFilters, 
    selectRecord 
  } = usePublicRecords()
  
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    type: 'all',
    urgency: 'all'
  })

  // Initialize data on component mount
  useEffect(() => {
    loadRecords()
  }, [])

  // Debounced search function to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((searchValue, currentFilters) => {
      const searchParams = {
        ...currentFilters,
        search: searchValue.trim()
      }
      
      // Update Redux filters and trigger API call
      updateFilters(searchParams)
      loadRecords(searchParams)
    }, 500), // 500ms delay
    []
  )

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Trigger debounced search
    debouncedSearch(value, localFilters)
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters }
    setLocalFilters(updatedFilters)
    
    // Combine with current search term
    const searchParams = {
      ...updatedFilters,
      search: searchTerm.trim()
    }
    
    // Update Redux state and trigger API call
    updateFilters(searchParams)
    loadRecords(searchParams)
  }

  // Handle voting
  const handleVote = async (recordId, voteType) => {
    if (!isAuthenticated) {
      // Could redirect to login or show modal
      return
    }
    await vote(recordId, voteType)
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    const searchParams = {
      ...localFilters,
      search: searchTerm.trim(),
      page: newPage
    }
    loadRecords(searchParams)
  }

  // Clear all filters and search
  const handleClearAll = () => {
    setSearchTerm('')
    setLocalFilters({
      status: 'all',
      type: 'all', 
      urgency: 'all'
    })
    
    updateFilters({ search: '' })
    loadRecords({ search: '' })
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm.trim() !== '' || 
           localFilters.status !== 'all' || 
           localFilters.type !== 'all' || 
           localFilters.urgency !== 'all'
  }, [searchTerm, localFilters])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Public Reports</h1>
          <p className="text-gray-600">
            Browse corruption reports and intervention requests from citizens across Africa
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports by title, description, or location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="input-field pl-10 w-full"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    debouncedSearch('', localFilters)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="btn-secondary flex items-center space-x-2"
              >
                {viewMode === 'list' ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
                <span>{viewMode === 'list' ? 'Map View' : 'List View'}</span>
              </button>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-primary-100 text-primary-800' : ''}`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 bg-primary-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Active Search/Filter Indicators */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
              {searchTerm.trim() && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      debouncedSearch('', localFilters)
                    }}
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {localFilters.status !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Status: {localFilters.status}
                  <button
                    onClick={() => handleFilterChange({ status: 'all' })}
                    className="ml-2 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {localFilters.type !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Type: {localFilters.type}
                  <button
                    onClick={() => handleFilterChange({ type: 'all' })}
                    className="ml-2 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {localFilters.urgency !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  Urgency: {localFilters.urgency}
                  <button
                    onClick={() => handleFilterChange({ urgency: 'all' })}
                    className="ml-2 hover:text-orange-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <RecordFilters 
                filters={localFilters} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-4 text-sm text-gray-600">
            {records.length > 0 ? (
              <>
                Showing {records.length} of {pagination.total || records.length} reports
                {hasActiveFilters && ' (filtered)'}
              </>
            ) : hasActiveFilters ? (
              'No reports match your search criteria'
            ) : (
              'No reports available'
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Records Display */}
        {viewMode === 'map' ? (
          <div className="h-[600px] bg-white rounded-lg shadow-sm border overflow-hidden">
            <RecordsMap
              records={records}
              onRecordSelect={selectRecord}
              className="w-full h-full"
            />
          </div>
        ) : (
          /* List View */
          loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {hasActiveFilters ? 'No matching reports found' : 'No reports available'}
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Check back later for new reports'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="btn-secondary"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onViewDetails={selectRecord}
                    onVote={handleVote}
                    showVoting={isAuthenticated}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages || loading}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* Record Details Modal */}
        {selectedRecord && (
          <RecordDetailsModal
            record={selectedRecord}
            onClose={() => selectRecord(null)}
            onVote={handleVote}
            showVoting={isAuthenticated}
          />
        )}
      </div>
    </div>
  )
}

export default PublicRecords