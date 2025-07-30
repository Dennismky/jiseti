import { useState, useEffect } from 'react'
import { MapPin, Target, Search } from 'lucide-react'
import GoogleMapContainer from './GoogleMapContainer'
import { getCurrentLocation } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

const LocationPicker = ({ value = {}, onChange, disabled = false }) => {
  const [selectedLocation, setSelectedLocation] = useState(value)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    setSelectedLocation(value)
  }, [value])

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    onChange(location)
    reverseGeocode(location.latitude, location.longitude)
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder()
      const result = await geocoder.geocode({
        location: { lat: parseFloat(lat), lng: parseFloat(lng) }
      })
      if (result.results?.[0]) {
        setAddress(result.results[0].formatted_address)
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
    }
  }

  const handleGetCurrentLocation = async () => {
    setLoading(true)
    try {
      const location = await getCurrentLocation()
      handleLocationSelect(location)
    } catch (error) {
      console.error('Failed to get current location:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualInput = (field, value) => {
    const newLocation = { ...selectedLocation, [field]: value }
    setSelectedLocation(newLocation)
    onChange(newLocation)
  }

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={loading || disabled}
        className="btn-secondary flex items-center space-x-2 w-full justify-center"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Target className="w-4 h-4" />
        )}
        <span>Use Current Location</span>
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
        onClick={() => setShowMap(!showMap)}
        className="btn-secondary flex items-center space-x-2 w-full justify-center"
        disabled={disabled}
      >
        <Search className="w-4 h-4" />
        <span>{showMap ? 'Hide Map' : 'Pick on Map'}</span>
      </button>

      {/* Interactive Map */}
      {showMap && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <GoogleMapContainer
            center={
              selectedLocation.latitude && selectedLocation.longitude
                ? { lat: parseFloat(selectedLocation.latitude), lng: parseFloat(selectedLocation.longitude) }
                : { lat: -1.2921, lng: 36.8219 } // Nairobi default
            }
            zoom={selectedLocation.latitude ? 15 : 10}
            onLocationSelect={handleLocationSelect}
            showMarkers={false}
          />
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
        </div>
      )}
    </div>
  )
}

export default LocationPicker