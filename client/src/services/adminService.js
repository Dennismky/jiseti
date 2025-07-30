import api from './api'

export const adminService = {
  async getAllRecords(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') queryParams.append(key, value)
    })
    
    // Fixed route path: /admin/records (matches your routes.py)
    const response = await api.get(`/admin/records?${queryParams}`)
    return response
  },

  async updateRecordStatus(id, status, reason = '') {
    // Fixed route path: /records/:id/status (matches your routes.py)
    const response = await api.patch(`/records/${id}/status`, { status, reason })
    return response
  },

  async getStats() {
    // Fixed route path: /admin/stats (matches your routes.py)
    const response = await api.get('/admin/stats')
    return response
  },
}