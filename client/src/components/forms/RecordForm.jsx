import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { RECORD_TYPES, URGENCY_LEVELS } from '../../constants'
import { validateCoordinates } from '../../utils/helpers'
import LocationPicker from '../maps/LocationPicker'
import LoadingSpinner from '../common/LoadingSpinner'

const RecordForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: RECORD_TYPES.RED_FLAG,
    urgency_level: URGENCY_LEVELS.MEDIUM,
    latitude: '',
    longitude: '',
    image_url: '',
    video_url: '',
    ...initialData
  })
  
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (formData.latitude && formData.longitude) {
      if (!validateCoordinates(formData.latitude, formData.longitude)) {
        newErrors.coordinates = 'Invalid coordinates'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="input-field"
          placeholder="Brief description of the issue"
          required
          disabled={loading}
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Type and Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="input-field"
            required
          >
            <option value={RECORD_TYPES.RED_FLAG}>Red Flag (Corruption)</option>
            <option value={RECORD_TYPES.INTERVENTION}>Intervention Request</option>
            <option value={RECORD_TYPES.INCIDENT}>General Incident</option>
            <option value={RECORD_TYPES.EMERGENCY}>Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency Level
          </label>
          <select
            value={formData.urgency_level}
            onChange={(e) => updateField('urgency_level', e.target.value)}
            className="input-field"
          >
            <option value={URGENCY_LEVELS.LOW}>Low</option>
            <option value={URGENCY_LEVELS.MEDIUM}>Medium</option>
            <option value={URGENCY_LEVELS.HIGH}>High</option>
            <option value={URGENCY_LEVELS.CRITICAL}>Critical</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows="4"
          className="input-field"
          placeholder="Provide detailed information about the issue"
          required
          disabled={loading}
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location (Optional)
        </label>
        <LocationPicker
          value={{ latitude: formData.latitude, longitude: formData.longitude }}
          onChange={(location) => {
            updateField('latitude', location.latitude)
            updateField('longitude', location.longitude)
          }}
          disabled={loading}
        />
        {errors.coordinates && <p className="text-red-600 text-sm mt-1">{errors.coordinates}</p>}
        {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
      </div>

      {/* Media URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => updateField('image_url', e.target.value)}
            className="input-field"
            placeholder="https://example.com/image.jpg"
            disabled={loading}
          />
          {formData.image_url && (
            <div className="mt-2">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div className="hidden text-sm text-red-600 bg-red-50 p-2 rounded">
                Failed to load image
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (Optional)
          </label>
          <input
            type="url"
            value={formData.video_url}
            onChange={(e) => updateField('video_url', e.target.value)}
            className="input-field"
            placeholder="https://example.com/video.mp4"
            disabled={loading}
          />
          {formData.video_url && (
            <div className="mt-2">
              <video
                src={formData.video_url}
                controls
                className="w-full h-32 rounded border"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              >
                Your browser does not support video playback.
              </video>
              <div className="hidden text-sm text-red-600 bg-red-50 p-2 rounded">
                Failed to load video
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
        </button>
      </div>
    </form>
  )
}

export default RecordForm