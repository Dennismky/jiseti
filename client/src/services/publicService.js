import api from './api'

export const publicService = {
  async getRecords(params = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') queryParams.append(key, value)
    })
    
    // Fixed route path: /public/records (matches your routes.py)
    const response = await api.get(`/public/records?${queryParams}`)
    return response
  },

  async getRecordDetails(id) {
    // Fixed route path: /public/records/:id (matches your routes.py)
    const response = await api.get(`/public/records/${id}`)
    return response
  },

  async voteRecord(recordId, voteType) {
    // Fixed route path: /records/:id/vote (matches your routes.py)
    const response = await api.post(`/records/${recordId}/vote`, { vote_type: voteType })
    return response
  },

  async removeVote(recordId) {
    // Fixed route path: /records/:id/vote (matches your routes.py)
    const response = await api.delete(`/records/${recordId}/vote`)
    return response
  },

  async submitAnonymousReport(reportData) {
    // Fixed route path: /public/report (matches your routes.py)
    const response = await api.post('/public/report', reportData)
    return response
  },
}