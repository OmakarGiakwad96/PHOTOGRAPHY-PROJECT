import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { bookings } from '../data/mockData'

export const bookingService = {
  getByUser: (userId) => withFallback(() => api.get(`/users/${userId}/bookings`), bookings.filter((b) => b.user_id === Number(userId))),
  getByPhotographer: (photographerId) => withFallback(() => api.get(`/photographers/${photographerId}/bookings`), bookings.filter((b) => b.photographer_id === Number(photographerId))),
  getAll: () => withFallback(() => api.get('/bookings'), bookings),
  getById: (id) => withFallback(() => api.get(`/bookings/${id}`), bookings.find((b) => b.booking_id === Number(id))),
  create: (payload) => withFallback(() => api.post('/bookings', payload), { booking_id: Date.now(), booking_status: 'pending', refund_status: 'none', ...payload }),
  updateStatus: (id, booking_status) => withFallback(() => api.patch(`/bookings/${id}/status`, { booking_status }), { booking_id: id, booking_status }),
  cancel: (id, cancel_reason) => withFallback(() => api.patch(`/bookings/${id}/cancel`, { cancel_reason }), { booking_id: id, booking_status: 'cancelled', cancel_reason }),
}
