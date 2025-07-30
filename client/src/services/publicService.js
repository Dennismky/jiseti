import api from './api'

export const publicService = {
  async getRecords(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') queryParams.append(key, value)
    })
    
    const response = await api.get(`/public/records?${queryParams}`)
    return response
  },

  async getRecordDetails(id) {
    const response = await api.get(`/public/records/${id}`)
    return response
  },

  async voteRecord(recordId, voteType) {
    const response = await api.post(`/records/${recordId}/vote`, { vote_type: voteType })
    return response
  },

  async removeVote(recordId) {
    const response = await api.delete(`/records/${recordId}/vote`)
    return response
  },

  async submitAnonymousReport(reportData) {
    const response = await api.post('/public/report', reportData)
    return response
  },
}