import { useEffect, useRef } from 'react'

const RecordMarker = ({ 
  map, 
  record, 
  onMarkerClick,
  onInfoWindowClick 
}) => {
  const markerRef = useRef(null)
  const infoWindowRef = useRef(null)

  useEffect(() => {
    if (!map || !record.latitude || !record.longitude) return

    // Create marker
    const marker = new window.google.maps.Marker({
      position: { 
        lat: parseFloat(record.latitude), 
        lng: parseFloat(record.longitude) 
      },
      map,
      title: record.title,
      icon: {
        url: getMarkerIcon(record.status, record.type),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      }
    })

    // Create info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: createInfoWindowContent(record)
    })

    // Add click listeners
    marker.addListener('click', () => {
      infoWindow.open(map, marker)
      if (onMarkerClick) {
        onMarkerClick(record)
      }
    })

    // Add info window click listener for view details
    infoWindow.addListener('domready', () => {
      const viewButton = document.getElementById(`view-record-${record.id}`)
      if (viewButton && onInfoWindowClick) {
        viewButton.addEventListener('click', () => {
          onInfoWindowClick(record)
        })
      }
    })

    markerRef.current = marker
    infoWindowRef.current = infoWindow

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
      }
    }
  }, [map, record, onMarkerClick, onInfoWindowClick])

  // Component doesn't render anything directly - it manages Google Maps objects
  return null
}

const getMarkerIcon = (status, type) => {
  const statusColors = {
    'draft': '#6B7280',
    'under investigation': '#3B82F6', 
    'resolved': '#10B981',
    'rejected': '#EF4444'
  }

  const typeIcons = {
    'red-flag': '🚩',
    'intervention': '⚡',
    'incident': '⚠️',
    'complaint': '📝',
    'suggestion': '💡',
    'emergency': '🚨'
  }

  const color = statusColors[status] || statusColors['draft']
  const icon = typeIcons[type] || '!'

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
      <text x="16" y="20" font-family="Arial" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${icon}</text>
    </svg>
  `)}`
}

const createInfoWindowContent = (record) => {
  const statusClasses = {
    'draft': 'bg-gray-100 text-gray-700 border-gray-300',
    'under investigation': 'bg-blue-100 text-blue-700 border-blue-300',
    'resolved': 'bg-green-100 text-green-700 border-green-300', 
    'rejected': 'bg-red-100 text-red-700 border-red-300'
  }

  const urgencyColors = {
    'low': 'text-gray-600',
    'medium': 'text-yellow-600', 
    'high': 'text-orange-600',
    'critical': 'text-red-600'
  }

  const statusClass = statusClasses[record.status] || statusClasses['draft']
  const urgencyColor = urgencyColors[record.urgency_level] || urgencyColors['medium']

  return `
    <div class="p-4 max-w-sm bg-white rounded-lg shadow-lg">
      <!-- Header -->
      <div class="mb-3">
        <h4 class="font-semibold text-gray-900 text-base mb-2 leading-tight">${record.title}</h4>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 text-xs rounded-full border ${statusClass}">
            ${record.status.toUpperCase()}
          </span>
          ${record.type ? `<span class="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">${record.type}</span>` : ''}
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-3 leading-relaxed">
        ${record.description.length > 120 ? record.description.substring(0, 120) + '...' : record.description}
      </p>

      <!-- Meta Information -->
      <div class="space-y-1 mb-3 text-xs text-gray-500">
        <div class="flex items-center justify-between">
          <span>📅 ${formatDate(record.created_at)}</span>
          <span class="${urgencyColor}">⚡ ${record.urgency_level || 'medium'}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>👥 ${record.vote_count || 0} votes</span>
          <span>👤 ${record.creator_name || 'Anonymous'}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-2 border-t border-gray-200">
        <button 
          id="view-record-${record.id}"
          class="flex-1 px-3 py-2 bg-primary-800 text-white text-xs rounded-md hover:bg-primary-700 transition-colors font-medium"
        >
          👁️ View Details
        </button>
        <button 
          onclick="window.open('https://maps.google.com/maps?q=${record.latitude},${record.longitude}', '_blank')"
          class="px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors"
          title="Open in Google Maps"
        >
          🗺️
        </button>
      </div>
    </div>
  `
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

export default RecordMarker