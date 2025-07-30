import { X, MapPin, Calendar, ThumbsUp, AlertTriangle, User } from 'lucide-react'
import { formatDate, getStatusColor } from '../../utils/helpers'

const RecordDetailsModal = ({ record, onClose, onVote, showVoting = false }) => {
  if (!record) return null

  const handleVote = (voteType) => {
    onVote(record.id, voteType)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            </div>
          </div>

          {/* Media */}
          {(record.image_url || record.video_url) && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Evidence</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.image_url && (
                  <img
                    src={record.image_url}
                    alt="Evidence"
                    className="w-full h-64 object-cover rounded-lg border"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                {record.video_url && (
                  <video
                    src={record.video_url}
                    controls
                    className="w-full h-64 rounded-lg border"
                  >
                    Your browser does not support video playback.
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Description</h4>
            <p className="text-gray-700 leading-relaxed">{record.description}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
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
            </div>

            {(record.latitude && record.longitude) && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Location: {parseFloat(record.latitude).toFixed(4)}, {parseFloat(record.longitude).toFixed(4)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Voting Actions */}
          {showVoting && (
            <div className="flex items-center justify-center space-x-4 pt-6 border-t">
              <button
                onClick={() => handleVote('support')}
                className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Support This Report</span>
              </button>
              
              <button
                onClick={() => handleVote('urgent')}
                className="flex items-center space-x-2 px-6 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
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