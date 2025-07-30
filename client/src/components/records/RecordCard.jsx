import { MapPin, Calendar, ThumbsUp, AlertTriangle, Eye } from 'lucide-react'
import { formatDate, getStatusColor, truncateText } from '../../utils/helpers'

const RecordCard = ({ record, onViewDetails, onVote, showVoting = false }) => {
  const handleVote = (voteType, e) => {
    e.stopPropagation()
    onVote(record.id, voteType)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails(record)}
    >
      {/* Image */}
      {record.image_url && (
        <div className="h-48 rounded-t-lg overflow-hidden">
          <img
            src={record.image_url}
            alt={record.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {record.title}
            </h3>
            <span className={`status-badge ${getStatusColor(record.status)}`}>
              {record.status}
            </span>
          </div>
          
          {record.type && (
            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
              {record.type}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm">
          {truncateText(record.description, 120)}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(record.created_at)}</span>
            </div>
            
            {record.latitude && record.longitude && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Located</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{record.vote_count || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(record)
            }}
            className="flex items-center space-x-1 text-primary-800 hover:text-primary-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">View Details</span>
          </button>

          {showVoting && (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleVote('support', e)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Support</span>
              </button>
              
              <button
                onClick={(e) => handleVote('urgent', e)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Urgent</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecordCard