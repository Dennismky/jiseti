export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const RECORD_TYPES = {
  RED_FLAG: 'red-flag',
  INTERVENTION: 'intervention',
  INCIDENT: 'incident',
  COMPLAINT: 'complaint',
  SUGGESTION: 'suggestion',
  EMERGENCY: 'emergency'
}

// FIXED: Match backend status values exactly (with hyphens, not spaces)
export const RECORD_STATUS = {
  DRAFT: 'draft',
  INVESTIGATING: 'under-investigation',  // Fixed: was 'under investigation'
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

// Status display names for UI (what users see)
export const STATUS_DISPLAY_NAMES = {
  'draft': 'Draft',
  'under-investigation': 'Under Investigation',  // Backend value -> Display name
  'resolved': 'Resolved',
  'rejected': 'Rejected'
}

// Function to get display name from backend status
export const getStatusDisplayName = (backendStatus) => {
  return STATUS_DISPLAY_NAMES[backendStatus] || backendStatus
}