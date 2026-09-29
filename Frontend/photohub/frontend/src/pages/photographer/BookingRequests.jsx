import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/bookingService'
import { getPhotographerByUserId, getUserById } from '../../data/mockData'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

export default function BookingRequests() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingService.getByPhotographer(photographer.photographer_id).then((data) => { setBookings(data); setLoading(false) })
  }, [photographer.photographer_id])

  async function updateStatus(booking, status) {
    await bookingService.updateStatus(booking.booking_id, status)
    setBookings((prev) => prev.map((b) => (b.booking_id === booking.booking_id ? { ...b, booking_status: status } : b)))
    addToast(`Booking marked as ${status}.`, 'success')
  }

  if (loading) return <Loader />

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Booking Requests</h2>
      {bookings.length === 0 ? (
        <EmptyState title="No requests yet" message="New booking requests from clients will appear here." />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const client = getUserById(b.user_id)
            return (
              <div key={b.booking_id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{client?.name}</p>
                    <Badge status={b.booking_status} />
                  </div>
                  <p className="text-sm text-ink/60">{formatDate(b.event_date)} · {b.booking_time} · {b.location}</p>
                  <p className="text-sm font-medium text-brass mt-1">{formatCurrency(b.total_price)}</p>
                </div>
                {b.booking_status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => updateStatus(b, 'confirmed')}>Accept</button>
                    <button className="btn-outline !px-4 !py-2 text-sm !text-rose-600 !border-rose-200" onClick={() => updateStatus(b, 'rejected')}>Decline</button>
                  </div>
                )}
                {b.booking_status === 'confirmed' && (
                  <button className="btn-outline !px-4 !py-2 text-sm" onClick={() => updateStatus(b, 'completed')}>Mark completed</button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
