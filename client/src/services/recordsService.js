import api from './api'

export const recordsService = {
  async getMyRecords(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') queryParams.append(key, value)
    })
    
    // Fixed route path: /my-records (matches your routes.py)
    const response = await api.get(`/my-records?${queryParams}`)
    return response
  },

  async createRecord(recordData) {
    // Fixed route path: /records (matches your routes.py)
    const response = await api.post('/records', recordData)
    return response
  },

  async updateRecord(id, data) {
    // Fixed route path: /records/:id (matches your routes.py)
    const response = await api.patch(`/records/${id}`, data)
    return response
  },

  async deleteRecord(id) {
    // Fixed route path: /records/:id (matches your routes.py)
    const response = await api.delete(`/records/${id}`)
    return response
  },

  async getRecordHistory(id) {
    // Fixed route path: /records/:id/history (matches your routes.py)
    const response = await api.get(`/records/${id}/history`)
    return response
  },
}