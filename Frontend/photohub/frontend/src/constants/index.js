export const APP_NAME = 'PhotoHub'

export const ROLES = {
  CLIENT: 'client',
  PHOTOGRAPHER: 'photographer',
  ADMIN: 'admin',
}

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

export const REFUND_STATUS = {
  NONE: 'none',
  REQUESTED: 'requested',
  PROCESSING: 'processing',
  REFUNDED: 'refunded',
  DENIED: 'denied',
}

export const CATEGORIES = ['Wedding', 'Portrait', 'Fashion', 'Corporate', 'Newborn', 'Maternity', 'Travel']

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
