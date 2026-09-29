import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { payments } from '../data/mockData'

export const paymentService = {
  getByUser: (userId, bookingsForUser = []) =>
    withFallback(() => api.get(`/users/${userId}/payments`), payments.filter((p) => bookingsForUser.some((b) => b.booking_id === p.booking_id))),
  getAll: () => withFallback(() => api.get('/payments'), payments),
  getByBooking: (bookingId) => withFallback(() => api.get(`/bookings/${bookingId}/payments`), payments.filter((p) => p.booking_id === Number(bookingId))),
  create: (payload) => withFallback(() => api.post('/payments', payload), { payment_id: Date.now(), payment_status: 'pending', ...payload }),
  updateStatus: (id, payment_status) => withFallback(() => api.patch(`/payments/${id}/status`, { payment_status }), { payment_id: id, payment_status }),
}
