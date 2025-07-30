export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status) => {
  const colors = {
    'draft': 'status-draft',
    'under investigation': 'status-investigating',
    'resolved': 'status-resolved',
    'rejected': 'status-rejected'
  }
  return colors[status] || 'status-draft'
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat)
  const longitude = parseFloat(lng)
  return !isNaN(latitude) && !isNaN(longitude) && 
         latitude >= -90 && latitude <= 90 && 
         longitude >= -180 && longitude <= 180
}

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  })
}