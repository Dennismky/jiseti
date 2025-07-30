import api from './api'

export const recordsService = {
  async getMyRecords(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') queryParams.append(key, value)
    })
    
    const response = await api.get(`/my-records?${queryParams}`)
    return response
  },

  async createRecord(recordData) {
    const response = await api.post('/records', recordData)
    return response
  },

  async updateRecord(id, data) {
    const response = await api.patch(`/records/${id}`, data)
    return response
  },

  async deleteRecord(id) {
    const response = await api.delete(`/records/${id}`)
    return response
  },

  async getRecordHistory(id) {
    const response = await api.get(`/records/${id}/history`)
    return response
  },
}