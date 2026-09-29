import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { refunds } from '../data/mockData'

export const refundService = {
  getAll: () => withFallback(() => api.get('/refunds'), refunds),
  requestRefund: (payload) => withFallback(() => api.post('/refunds', payload), { refund_id: Date.now(), refund_status: 'pending', ...payload }),
  approve: (id, approved_by_admin_id) => withFallback(() => api.patch(`/refunds/${id}/approve`, { approved_by_admin_id }), { refund_id: id, refund_status: 'processed' }),
  reject: (id) => withFallback(() => api.patch(`/refunds/${id}/reject`), { refund_id: id, refund_status: 'rejected' }),
}
