import { useState, useEffect } from 'react'
import { MapPin, Target, Search, AlertCircle } from 'lucide-react'
import GoogleMapContainer from './GoogleMapContainer'
import { getCurrentLocation } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const LocationPicker = ({ value = {}, onChange, disabled = false }) => {
  const [selectedLocation, setSelectedLocation] = useState(value)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    setSelectedLocation(value)
  }, [value])

  // Reverse geocoding when location changes
  useEffect(() => {
    if (selectedLocation.latitude && selectedLocation.longitude && window.google) {
      reverseGeocode(selectedLocation.latitude, selectedLocation.longitude)
    }
  }, [selectedLocation])

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    onChange(location)
    setLocationError('')
    
    // Reverse geocode the new location
    if (window.google) {
      reverseGeocode(location.latitude, location.longitude)
    }
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      if (!window.google || !window.google.maps) {
        return
      }

      const geocoder = new window.google.maps.Geocoder()
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat: parseFloat(lat), lng: parseFloat(lng) } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0])
            } else {
              reject(new Error(`Geocoding failed: ${status}`))
            }
          }
        )
      })
      
      if (result) {
        setAddress(result.formatted_address)
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      setAddress('')
    }
  }

  const handleGetCurrentLocation = async () => {
    setLoading(true)
    setLocationError('')
    
    try {
      const location = await getCurrentLocation()
      handleLocationSelect(location)
    } catch (error) {
      setLocationError(getLocationErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const getLocationErrorMessage = (error) => {
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        return 'Location access denied. Please enable location permissions in your browser.'
      case 2: // POSITION_UNAVAILABLE
        return 'Location information is unavailable. Please try again.'
      case 3: // TIMEOUT
        return 'Location request timed out. Please try again.'
      default:
        return 'Unable to get your location. Please try manual entry.'
    }
  }

  const handleManualInput = (field, value) => {
    const newLocation = { ...selectedLocation, [field]: value }
    setSelectedLocation(newLocation)
    onChange(newLocation)
    setLocationError('')
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  return (
    <div className="space-y-4">
      {/* Error Messages */}
      {locationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{locationError}</span>
          </div>
        </div>
      )}

      {/* Current Location Button */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={loading || disabled}
        className="btn-secondary flex items-center space-x-2 w-full justify-center disabled:opacity-50"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Target className="w-4 h-4" />
        )}
        <span>{loading ? 'Getting location...' : 'Use Current Location'}</span>
      </button>

      {/* Manual Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={selectedLocation.latitude || ''}
            onChange={(e) => handleManualInput('latitude', e.target.value)}
            className="input-field"
            placeholder="-1.2921"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={selectedLocation.longitude || ''}
            onChange={(e) => handleManualInput('longitude', e.target.value)}
            className="input-field"
            placeholder="36.8219"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Address Display */}
      {address && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{address}</span>
          </div>
        </div>
      )}

      {/* Map Toggle */}
      <button
        type="button"
        onClick={toggleMap}
        className="btn-secondary flex items-center space-x-2 w-full justify-center"
        disabled={disabled}
      >
        <Search className="w-4 h-4" />
        <span>{showMap ? 'Hide Map' : 'Pick on Map'}</span>
      </button>

      {/* Interactive Map */}
      {showMap && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="h-[400px]">
            <GoogleMapContainer
              center={
                selectedLocation.latitude && selectedLocation.longitude
                  ? { 
                      lat: parseFloat(selectedLocation.latitude), 
                      lng: parseFloat(selectedLocation.longitude) 
                    }
                  : { lat: -1.2921, lng: 36.8219 } // Nairobi default
              }
              zoom={selectedLocation.latitude ? 15 : 10}
              onLocationSelect={handleLocationSelect}
              showMarkers={false}
              records={[]} // Empty records array since this is for location picking
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            />
          </div>
          
          {/* Map Instructions */}
          <div className="bg-blue-50 p-3 border-t">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Click anywhere on the map to select that location for your report.
            </p>
          </div>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation.latitude && selectedLocation.longitude && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-green-800">
            <MapPin className="w-4 h-4" />
            <span>
              Selected: {parseFloat(selectedLocation.latitude).toFixed(6)}, {parseFloat(selectedLocation.longitude).toFixed(6)}
            </span>
          </div>
          
          {/* Clear Location Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedLocation({})
              onChange({})
              setAddress('')
            }}
            className="mt-2 text-xs text-green-600 hover:text-green-800 underline"
            disabled={disabled}
          >
            Clear location
          </button>
        </div>
      )}
    </div>
  )
}

export default LocationPicker