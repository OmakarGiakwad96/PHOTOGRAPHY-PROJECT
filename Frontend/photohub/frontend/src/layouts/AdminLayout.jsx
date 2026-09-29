import DashboardLayout from './DashboardLayout'

const adminNav = [
  { to: '/admin/dashboard', label: 'Overview', icon: '📊', end: true },
  { to: '/admin/users', label: 'Users', icon: '👤' },
  { to: '/admin/photographers', label: 'Photographers', icon: '📷' },
  { to: '/admin/approvals', label: 'Approvals', icon: '✅' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
  { to: '/admin/refunds', label: 'Refunds', icon: '↩️' },
  { to: '/admin/payment-issues', label: 'Payment Issues', icon: '⚠️' },
  { to: '/admin/logs', label: 'System Logs', icon: '🧾' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminLayout() {
  return <DashboardLayout items={adminNav} title="Admin Panel" />
}
