import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import RecordMarker from './RecordMarker'
import LoadingSpinner from '../common/LoadingSpinner'

const MapComponent = ({ 
  records = [], 
  center, 
  zoom = 10, 
  onLocationSelect, 
  onRecordSelect,
  showMarkers = true 
}) => {
  const ref = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: center || { lat: -1.2921, lng: 36.8219 }, // Nairobi default
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      })
      setMap(newMap)

      // Add click listener for location selection
      if (onLocationSelect) {
        newMap.addListener('click', (e) => {
          onLocationSelect({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
          })
        })
      }
    }
  }, [ref, map, center, zoom, onLocationSelect])

  // Auto-fit bounds when records change
  useEffect(() => {
    if (!map || !records.length || !showMarkers) return

    const validRecords = records.filter(r => r.latitude && r.longitude)
    if (validRecords.length === 0) return

    if (validRecords.length === 1) {
      // Single record - center on it
      const record = validRecords[0]
      map.setCenter({ 
        lat: parseFloat(record.latitude), 
        lng: parseFloat(record.longitude) 
      })
      map.setZoom(15)
    } else {
      // Multiple records - fit bounds
      const bounds = new window.google.maps.LatLngBounds()
      validRecords.forEach(record => {
        bounds.extend({ 
          lat: parseFloat(record.latitude), 
          lng: parseFloat(record.longitude) 
        })
      })
      map.fitBounds(bounds)
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'bounds_changed', () => {
        if (map.getZoom() > 15) {
          map.setZoom(15)
        }
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [map, records, showMarkers])

  const handleMarkerClick = (record) => {
    // Optional callback for marker clicks
    console.log('Marker clicked:', record.title)
  }

  const handleInfoWindowClick = (record) => {
    // Handle view details click from info window
    if (onRecordSelect) {
      onRecordSelect(record)
    }
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={ref} className="w-full h-full rounded-lg" />
      
      {/* Render markers as React components */}
      {map && showMarkers && records
        .filter(record => record.latitude && record.longitude)
        .map(record => (
          <RecordMarker
            key={record.id}
            map={map}
            record={record}
            onMarkerClick={handleMarkerClick}
            onInfoWindowClick={handleInfoWindowClick}
          />
        ))
      }
      
      {/* Record count indicator */}
      {showMarkers && records.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-primary-800 rounded-full"></div>
            <span className="font-medium text-gray-700">
              {records.filter(r => r.latitude && r.longitude).length} records
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const GoogleMapContainer = ({ apiKey, ...props }) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )
      case Status.FAILURE:
        return (
          <div className="w-full h-[400px] flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <p className="text-red-600 font-medium">Failed to load Google Maps</p>
              <p className="text-sm text-red-500 mt-1">Please check your API key configuration</p>
              <p className="text-xs text-gray-500 mt-2">
                Set VITE_GOOGLE_MAPS_API_KEY in your environment
              </p>
            </div>
          </div>
        )
      case Status.SUCCESS:
        return <MapComponent {...props} />
      default:
        return (
          <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
            <LoadingSpinner size="lg" />
          </div>
        )
    }
  }

  return (
    <Wrapper 
      apiKey={apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
      render={render}
      libraries={['places', 'geometry']}
    />
  )
}

export default GoogleMapContainer