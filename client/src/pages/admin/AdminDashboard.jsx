// ==================== src/pages/admin/AdminDashboard.jsx ====================
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { adminService } from '../../services/adminService'
import { formatDate, getStatusColor, getStatusDisplayName } from '../../utils/helpers'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  X, 
  Eye, 
  Edit, 
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle  // FIXED: Added missing import
} from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import GoogleMapContainer from '../../components/maps/GoogleMapContainer'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [recordsResponse, statsResponse] = await Promise.all([
        adminService.getAllRecords(),
        adminService.getStats()
      ])
      setRecords(recordsResponse.records || [])
      setStats(statsResponse)
      setError('')
    } catch (error) {
      setError(error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (recordId, newStatus, reason = '') => {
    setStatusLoading(true)
    try {
      await adminService.updateRecordStatus(recordId, newStatus, reason)
      
      // Update local state
      setRecords(prev => prev.map(record => 
        record.id === recordId ? { ...record, status: newStatus } : record
      ))
      
      setShowStatusModal(false)
      setSelectedRecord(null)
      toast.success(`Status updated to ${getStatusDisplayName(newStatus)}`)
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setStatusLoading(false)
    }
  }

  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true
    return record.status === filter
  })

  const statusCounts = {
    total: records.length,
    draft: records.filter(r => r.status === 'draft').length,
    investigating: records.filter(r => r.status === 'under-investigation').length,
    resolved: records.filter(r => r.status === 'resolved').length,
    rejected: records.filter(r => r.status === 'rejected').length
  }

  // Check if record has valid coordinates
  const hasLocation = (record) => {
    return record.latitude && record.longitude && 
      !isNaN(parseFloat(record.latitude)) && !isNaN(parseFloat(record.longitude))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}. Manage reports and monitor system activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.investigating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Records Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Manage Records</h2>
              
              {/* Filters */}
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'under-investigation', label: 'Under Investigation' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'rejected', label: 'Rejected' }
                ].map((statusOption) => (
                  <button
                    key={statusOption.value}
                    onClick={() => setFilter(statusOption.value)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      filter === statusOption.value
                        ? 'bg-primary-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {statusOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-6 border-b">
              <ErrorMessage message={error} onClose={() => setError('')} />
            </div>
          )}

          {/* Records Table */}
          {loading ? (
            <div className="p-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">No records match your current filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Record</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {record.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{record.type || 'General'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${getStatusColor(record.status)}`}>
                          {getStatusDisplayName(record.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="text-primary-800 hover:text-primary-700"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRecord(record)
                              setShowStatusModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Record Details Modal - WITH GOOGLE MAPS API KEY CHECK */}
        {selectedRecord && !showStatusModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Record Details</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Title and Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{selectedRecord.title}</h3>
                  <div className="flex items-center space-x-3">
                    <span className={`status-badge ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusDisplayName(selectedRecord.status)}
                    </span>
                    {selectedRecord.type && (
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                        {selectedRecord.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Description and Info */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedRecord.description}</p>
                      </div>
                    </div>

                    {/* Evidence */}
                    {(selectedRecord.image_url || selectedRecord.video_url) && (
                      <div>
                        <h4 className="font-medium mb-2">Evidence</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedRecord.image_url && (
                            <img
                              src={selectedRecord.image_url}
                              alt="Evidence"
                              className="w-full h-48 object-cover rounded border"
                            />
                          )}
                          {selectedRecord.video_url && (
                            <video
                              src={selectedRecord.video_url}
                              controls
                              className="w-full h-48 rounded border"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Report Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Created: {formatDate(selectedRecord.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Reporter: {selectedRecord.creator_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Votes: {selectedRecord.vote_count || 0}</span>
                        </div>
                        {selectedRecord.urgency_level && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-gray-500" />
                            <span>Urgency: {selectedRecord.urgency_level}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location Map */}
                  <div className="space-y-6">
                    {hasLocation(selectedRecord) ? (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Location</span>
                        </h4>
                        
                        {/* Location Name */}
                        {selectedRecord.location_name && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 font-medium">{selectedRecord.location_name}</p>
                          </div>
                        )}

                        {/* FIXED: Check if Google Maps API key is configured */}
                        {import.meta.env.VITE_GOOGLE_MAPS_API_KEY && 
                         import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' ? (
                          <>
                            {/* Interactive Map */}
                            <div className="h-80 w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                              <GoogleMapContainer
                                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                                records={[selectedRecord]}
                                center={{
                                  lat: parseFloat(selectedRecord.latitude),
                                  lng: parseFloat(selectedRecord.longitude)
                                }}
                                zoom={15}
                                showMarkers={true}
                                onRecordSelect={() => {}}
                              />
                            </div>

                            {/* External Map Links */}
                            <div className="flex justify-center space-x-4 mt-3">
                              <a
                                href={`https://www.google.com/maps?q=${selectedRecord.latitude},${selectedRecord.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                Open in Google Maps
                              </a>
                              <a
                                href={`https://www.openstreetmap.org/?mlat=${selectedRecord.latitude}&mlon=${selectedRecord.longitude}&zoom=15`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                Open in OpenStreetMap
                              </a>
                            </div>
                          </>
                        ) : (
                          /* Fallback when no API key */
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="text-center">
                              <MapPin className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                              <p className="text-sm text-yellow-800 font-medium mb-2">Google Maps API Key Required</p>
                              <p className="text-xs text-yellow-700 mb-3">
                                Configure VITE_GOOGLE_MAPS_API_KEY in your .env file to display interactive maps
                              </p>
                              <div className="space-y-2">
                                <a
                                  href={`https://www.google.com/maps?q=${selectedRecord.latitude},${selectedRecord.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                  View on Google Maps
                                </a>
                                <a
                                  href={`https://www.openstreetmap.org/?mlat=${selectedRecord.latitude}&mlon=${selectedRecord.longitude}&zoom=15`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                  View on OpenStreetMap
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Coordinates */}
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Coordinates: {parseFloat(selectedRecord.latitude).toFixed(6)}, {parseFloat(selectedRecord.longitude).toFixed(6)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Location</span>
                        </h4>
                        <div className="bg-gray-100 h-80 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No location data available</p>
                            {selectedRecord.location_name && (
                              <p className="text-xs mt-1">Location: {selectedRecord.location_name}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Resolution Notes */}
                    {selectedRecord.resolution_notes && (
                      <div>
                        <h4 className="font-medium mb-3">Resolution Notes</h4>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-green-800 text-sm leading-relaxed">{selectedRecord.resolution_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal - UNCHANGED */}
        {showStatusModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900">Update Status</h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Record: <span className="font-medium">{selectedRecord.title}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Status: <span className={`font-medium ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusDisplayName(selectedRecord.status)}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Select new status:</p>
                  
                  {selectedRecord.status !== 'under-investigation' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedRecord.id, 'under-investigation')}
                      disabled={statusLoading}
                      className="w-full text-left px-4 py-3 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      <div className="font-medium">Under Investigation</div>
                      <div className="text-xs text-blue-600">Mark this record as being actively investigated</div>
                    </button>
                  )}

                  {selectedRecord.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedRecord.id, 'resolved')}
                      disabled={statusLoading}
                      className="w-full text-left px-4 py-3 border border-green-200 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <div className="font-medium">Resolved</div>
                      <div className="text-xs text-green-600">Mark this record as resolved and completed</div>
                    </button>
                  )}

                  {selectedRecord.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedRecord.id, 'rejected')}
                      disabled={statusLoading}
                      className="w-full text-left px-4 py-3 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <div className="font-medium">Rejected</div>
                      <div className="text-xs text-red-600">Reject this record (false claim or invalid)</div>
                    </button>
                  )}
                </div>

                {statusLoading && (
                  <div className="mt-4 flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-600">Updating status...</span>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    disabled={statusLoading}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard