import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/bookingService'
import { getPhotographerByUserId, getUserById } from '../../data/mockData'
import StatCard from '../../components/dashboard/StatCard'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function PhotographerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }

  useEffect(() => {
    bookingService.getByPhotographer(photographer.photographer_id).then((data) => { setBookings(data); setLoading(false) })
  }, [photographer.photographer_id])

  if (loading) return <Loader />

  const pending = bookings.filter((b) => b.booking_status === 'pending')
  const earnings = bookings.filter((b) => b.booking_status === 'completed').reduce((s, b) => s + b.total_price, 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold mb-1">Hi {user.name.split(' ')[0]}, here's your studio snapshot</h2>
        <p className="text-sm text-ink/60">Manage requests, packages and earnings from here.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total bookings" value={bookings.length} tone="ink" />
        <StatCard label="Pending requests" value={pending.length} tone="brass" />
        <StatCard label="Earnings (completed)" value={formatCurrency(earnings)} tone="teal" />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Recent booking requests</h3>
          <Link to="/photographer/bookings" className="text-sm text-brass hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {bookings.slice(0, 5).map((b) => {
            const client = getUserById(b.user_id)
            return (
              <div key={b.booking_id} className="flex items-center justify-between border-b border-black/5 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="font-medium">{client?.name}</p>
                  <p className="text-xs text-ink/50">{formatDate(b.event_date)} · {b.location}</p>
                </div>
                <Badge status={b.booking_status} />
              </div>
            )
          })}
          {bookings.length === 0 && <p className="text-sm text-ink/50">No booking requests yet.</p>}
        </div>
      </div>
    </div>
  )
}
