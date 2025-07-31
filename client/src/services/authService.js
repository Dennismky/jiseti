import api from './api'

export const authService = {
  async login(email, password) {
  
    try {
      const response = await api.post('/admin/login', { email, password })
      return response
    } catch (adminError) {
      
      try {
        const response = await api.post('/auth/login', { email, password })
        return response
      } catch (userError) {
        throw new Error(userError.error || 'Invalid credentials')
      }
    }
  },

  async register(userData) {
    const response = await api.post('/auth/signup', userData)
    return response
  },

  async getCurrentUser() {
    const response = await api.get('/user')
    return response
  },

  async updateProfile(data) {
    const response = await api.patch('/user/profile', data)
    return response
  },
}