import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/bookingService'
import { getPhotographerByUserId } from '../../data/mockData'
import StatCard from '../../components/dashboard/StatCard'
import DataTable from '../../components/tables/DataTable'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function Earnings() {
  const { user } = useAuth()
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingService.getByPhotographer(photographer.photographer_id).then((data) => { setBookings(data); setLoading(false) })
  }, [photographer.photographer_id])

  if (loading) return <Loader />

  const completed = bookings.filter((b) => b.booking_status === 'completed')
  const total = completed.reduce((s, b) => s + b.total_price, 0)
  const pendingRevenue = bookings.filter((b) => b.booking_status === 'confirmed').reduce((s, b) => s + b.total_price, 0)

  const columns = [
    { key: 'booking_id', header: 'Booking' },
    { key: 'event_date', header: 'Date', render: (r) => formatDate(r.event_date) },
    { key: 'total_price', header: 'Amount', render: (r) => formatCurrency(r.total_price) },
    { key: 'booking_status', header: 'Status', render: (r) => <Badge status={r.booking_status} /> },
  ]

  return (
    <div className="space-y-8">
      <h2 className="font-display text-xl font-semibold">Earnings</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total earned" value={formatCurrency(total)} tone="brass" />
        <StatCard label="In-progress revenue" value={formatCurrency(pendingRevenue)} tone="teal" />
        <StatCard label="Completed shoots" value={completed.length} tone="ink" />
      </div>
      <div className="card p-5">
        <DataTable columns={columns} rows={bookings} />
      </div>
    </div>
  )
}
