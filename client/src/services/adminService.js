import api from './api'

export const adminService = {
  async getAllRecords(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') queryParams.append(key, value)
    })
    

    const response = await api.get(`/admin/records?${queryParams}`)
    return response
  },

  async updateRecordStatus(id, status, reason = '') {
    
    const response = await api.patch(`/records/${id}/status`, { status, reason })
    return response
  },

  async getStats() {
    
    const response = await api.get('/admin/stats')
    return response
  },
}