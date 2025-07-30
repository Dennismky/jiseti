export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const RECORD_TYPES = {
  RED_FLAG: 'red-flag',
  INTERVENTION: 'intervention',
  INCIDENT: 'incident',
  COMPLAINT: 'complaint',
  SUGGESTION: 'suggestion',
  EMERGENCY: 'emergency'
}

export const RECORD_STATUS = {
  DRAFT: 'draft',
  INVESTIGATING: 'under investigation',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

export const VOTE_TYPES = {
  SUPPORT: 'support',
  URGENT: 'urgent'
}

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const ROUTES = {
  HOME: '/',
  RECORDS: '/records',
  MAP: '/map',
  REPORT: '/report',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin'
}