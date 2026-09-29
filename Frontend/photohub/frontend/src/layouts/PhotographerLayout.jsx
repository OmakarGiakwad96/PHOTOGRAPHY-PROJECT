import DashboardLayout from './DashboardLayout'

const photographerNav = [
  { to: '/photographer/dashboard', label: 'Overview', icon: '📊', end: true },
  { to: '/photographer/bookings', label: 'Booking Requests', icon: '📅' },
  { to: '/photographer/packages', label: 'Packages', icon: '📦' },
  { to: '/photographer/portfolio', label: 'Portfolio', icon: '🖼️' },
  { to: '/photographer/earnings', label: 'Earnings', icon: '💰' },
  { to: '/photographer/profile', label: 'Profile', icon: '👤' },
]

export default function PhotographerLayout() {
  return <DashboardLayout items={photographerNav} title="Photographer Studio" />
}
