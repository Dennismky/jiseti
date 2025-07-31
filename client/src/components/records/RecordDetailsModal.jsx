import { X, Calendar, ThumbsUp, AlertTriangle, User, MapPin } from 'lucide-react'
import { formatDate, getStatusColor } from '../../utils/helpers'
import GoogleMapContainer from '../maps/GoogleMapContainer'

const RecordDetailsModal = ({ record, onClose, onVote, showVoting = false }) => {
  if (!record) return null

  const handleVote = (voteType) => {
    onVote(record.id, voteType)
  }

  // Check if record has valid coordinates
  const hasLocation = record.latitude && record.longitude && 
    !isNaN(parseFloat(record.latitude)) && !isNaN(parseFloat(record.longitude))

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Title and Status */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{record.title}</h3>
            <div className="flex items-center space-x-4">
              <span className={`status-badge ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
              {record.type && (
                <span className="text-sm px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                  {record.type}
                </span>
              )}
              {record.urgency_level && (
                <span className={`text-sm px-3 py-1 rounded-full ${
                  record.urgency_level === 'critical' ? 'bg-red-100 text-red-800' :
                  record.urgency_level === 'high' ? 'bg-orange-100 text-orange-800' :
                  record.urgency_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {record.urgency_level} priority
                </span>
              )}
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Description and Media */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{record.description}</p>
                </div>
              </div>

              {/* Media */}
              {(record.image_url || record.video_url) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Evidence</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {record.image_url && (
                      <div className="relative">
                        <img
                          src={record.image_url}
                          alt="Evidence"
                          className="w-full h-64 object-cover rounded-lg border shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                        <div className="hidden bg-gray-100 h-64 rounded-lg border flex items-center justify-center">
                          <span className="text-gray-500">Failed to load image</span>
                        </div>
                      </div>
                    )}
                    {record.video_url && (
                      <div className="relative">
                        <video
                          src={record.video_url}
                          controls
                          className="w-full h-64 rounded-lg border shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        >
                          Your browser does not support video playback.
                        </video>
                        <div className="hidden bg-gray-100 h-64 rounded-lg border flex items-center justify-center">
                          <span className="text-gray-500">Failed to load video</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Report Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Reported: {formatDate(record.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Reporter: {record.creator_name || 'Anonymous'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{record.vote_count || 0} people support this</span>
                  </div>

                  {record.updated_at && record.updated_at !== record.created_at && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Updated: {formatDate(record.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Location Map */}
            <div className="space-y-6">
              {hasLocation ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </h4>
                  
                  {/* Location Name */}
                  {record.location_name && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">{record.location_name}</p>
                    </div>
                  )}

                  {/* FIXED: Interactive Map - Using proper props and container */}
                  <div className="h-80 w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <GoogleMapContainer
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      records={[record]}
                      center={{
                        lat: parseFloat(record.latitude),
                        lng: parseFloat(record.longitude)
                      }}
                      zoom={15}
                      showMarkers={true}
                      onRecordSelect={() => {}} // Empty function for modal context
                    />
                  </div>

                  {/* Coordinates (small text below map) */}
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Coordinates: {parseFloat(record.latitude).toFixed(6)}, {parseFloat(record.longitude).toFixed(6)}
                  </div>

                  {/* External Map Links */}
                  <div className="flex justify-center space-x-4 mt-3">
                    <a
                      href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Open in Google Maps
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${record.latitude}&mlon=${record.longitude}&zoom=15`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Open in OpenStreetMap
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </h4>
                  <div className="bg-gray-100 h-80 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No location data available</p>
                      {record.location_name && (
                        <p className="text-xs mt-1">Location: {record.location_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Notes (if any) */}
              {record.resolution_notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Resolution Notes</h4>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 text-sm leading-relaxed">{record.resolution_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voting Actions */}
          {showVoting && (
            <div className="flex items-center justify-center space-x-4 pt-8 mt-8 border-t">
              <button
                onClick={() => handleVote('support')}
                className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Support This Report</span>
              </button>
              
              <button
                onClick={() => handleVote('urgent')}
                className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Mark as Urgent</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecordDetailsModal