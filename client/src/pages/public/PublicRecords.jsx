import { useEffect, useState } from 'react'
import { usePublicRecords } from '../../hooks/usePublicRecords'
import { useAuth } from '../../hooks/useAuth'
import RecordCard from '../../components/records/RecordCard'
import RecordFilters from '../../components/records/RecordFilters'
import RecordDetailsModal from '../../components/records/RecordDetailsModal'
import RecordsMap from '../../components/maps/RecordsMap'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { Map, Search, Filter, List } from 'lucide-react'

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

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFilters({ search: searchTerm })
      loadRecords()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters)
    loadRecords()
  }

  const handleVote = async (recordId, voteType) => {
    if (!isAuthenticated) {
      // Show login modal or redirect
      return
    }
    await vote(recordId, voteType)
  }

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
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Filter Toggle and View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="btn-secondary flex items-center space-x-2"
              >
                {viewMode === 'list' ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
                <span>{viewMode === 'list' ? 'Map View' : 'List View'}</span>
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <RecordFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          )}
        </div>

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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
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
                      onClick={() => loadRecords({ page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    
                    <button
                      onClick={() => loadRecords({ page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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