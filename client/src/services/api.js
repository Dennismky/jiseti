import axios from 'axios'
import { API_BASE_URL } from '../constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // CORS Fix: Explicit credentials handling
  withCredentials: false, // Set to true only if you need cookies/sessions
})

// Request interceptor to add auth token (functionality unchanged)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // CORS Fix: Enhanced logging for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
        data: config.data ? Object.keys(config.data) : 'No data'
      })
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling (enhanced for CORS)
api.interceptors.response.use(
  (response) => {
    // CORS Fix: Success logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    return response.data
  },
  (error) => {
    // CORS Fix: Enhanced error handling with specific CORS detection
    if (!error.response) {
      // Network error - likely CORS, server not running, or connectivity issue
      console.error('[API Network Error]', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          fullURL: `${error.config?.baseURL}${error.config?.url}`
        }
      })
      
      // CORS Fix: Specific CORS error detection and helpful messages
      if (error.code === 'ERR_NETWORK' || 
          error.message.includes('CORS') || 
          error.message.includes('Network Error') ||
          error.message.includes('blocked')) {
        return Promise.reject({
          message: `CORS Error: Unable to connect to backend server at ${API_BASE_URL}. 
                   Please ensure:
                   1. Backend server is running on port 5000
                   2. CORS is properly configured
                   3. No firewall is blocking the connection`,
          type: 'CORS_ERROR',
          originalError: error.message
        })
      }
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        return Promise.reject({
          message: `Connection refused: Backend server is not running at ${API_BASE_URL}. 
                   Please start the Flask server with 'python app.py'`,
          type: 'CONNECTION_REFUSED',
          originalError: error.message
        })
      }
      
      return Promise.reject({
        message: `Network error: Unable to connect to server at ${API_BASE_URL}. 
                 Please check your internet connection and server status.`,
        type: 'NETWORK_ERROR',
        originalError: error.message
      })
    }
    
    // Handle authentication errors (functionality unchanged)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // CORS Fix: Enhanced error logging
    console.error(`[API Error] ${error.response.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      response: error.response.data,
      status: error.response.status,
      headers: error.response.headers
    })
    
    // Return the error response data (functionality unchanged)
    return Promise.reject(error.response?.data || error.message)
  }
)

export default api