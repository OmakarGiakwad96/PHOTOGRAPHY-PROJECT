import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { paymentIssues, systemLogs, users, photographers, bookings, payments } from '../data/mockData'

export const adminService = {
  getDashboardStats: () =>
    withFallback(() => api.get('/admin/stats'), {
      totalUsers: users.length,
      totalPhotographers: photographers.length,
      totalBookings: bookings.length,
      totalRevenue: payments.filter((p) => p.payment_status === 'success').reduce((sum, p) => sum + p.amount, 0),
      pendingApprovals: photographers.filter((p) => !p.is_verified).length,
      openIssues: paymentIssues.filter((i) => i.status === 'open' || i.status === 'in_review').length,
    }),
  getPaymentIssues: () => withFallback(() => api.get('/admin/payment-issues'), paymentIssues),
  resolveIssue: (id) => withFallback(() => api.patch(`/admin/payment-issues/${id}/resolve`), { issue_id: id, status: 'resolved' }),
  getLogs: () => withFallback(() => api.get('/admin/logs'), systemLogs),
}
