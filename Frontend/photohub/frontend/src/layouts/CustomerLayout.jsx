import DashboardLayout from './DashboardLayout'

const customerNav = [
  { to: '/customer/dashboard', label: 'Overview', icon: '📊', end: true },
  { to: '/customer/bookings', label: 'My Bookings', icon: '📅' },
  { to: '/customer/payments', label: 'Payment History', icon: '💳' },
  { to: '/customer/reviews', label: 'My Reviews', icon: '⭐' },
  { to: '/customer/profile', label: 'Profile', icon: '👤' },
]

export default function CustomerLayout() {
  return <DashboardLayout items={customerNav} title="My Account" />
}
