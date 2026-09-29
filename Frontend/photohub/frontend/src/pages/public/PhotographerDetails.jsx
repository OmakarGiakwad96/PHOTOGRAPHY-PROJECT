import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { photographerService } from '../../services/photographerService'
import { packageService } from '../../services/packageService'
import { portfolioService } from '../../services/portfolioService'
import { reviewService } from '../../services/reviewService'
import { bookingService } from '../../services/bookingService'
import RatingStars from '../../components/common/RatingStars'
import Loader from '../../components/common/Loader'
import Modal from '../../components/ui/Modal'
import Input from '../../components/forms/Input'
import Textarea from '../../components/forms/Textarea'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function PhotographerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addToast } = useToast()

  const [photographer, setPhotographer] = useState(null)
  const [pkgs, setPkgs] = useState([])
  const [portfolioItems, setPortfolioItems] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingPkg, setBookingPkg] = useState(null)
  const [form, setForm] = useState({ event_date: '', booking_time: '', location: '', special_requirements: '' })

  useEffect(() => {
    setLoading(true)
    Promise.all([
      photographerService.getById(id),
      packageService.getByPhotographer(id),
      portfolioService.getByPhotographer(id),
      reviewService.getByPhotographer(id),
    ]).then(([p, pk, port, rev]) => {
      setPhotographer(p)
      setPkgs(pk)
      setPortfolioItems(port)
      setReviews(rev)
      setLoading(false)
    })
  }, [id])

  async function confirmBooking() {
    if (!isAuthenticated) {
      addToast('Please log in to book a photographer.', 'error')
      navigate('/login')
      return
    }
    await bookingService.create({
      user_id: user.user_id,
      photographer_id: Number(id),
      package_id: bookingPkg.package_id,
      total_price: bookingPkg.price,
      ...form,
    })
    addToast('Booking request sent!', 'success')
    setBookingPkg(null)
    setForm({ event_date: '', booking_time: '', location: '', special_requirements: '' })
    navigate('/customer/bookings')
  }

  if (loading) return <Loader label="Loading photographer profile..." />
  if (!photographer) return <div className="container-page py-20 text-center">Photographer not found.</div>

  return (
    <div className="container-page py-14">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="h-56 rounded-2xl bg-gradient-to-br from-ink to-teal flex items-center justify-center text-paper/30 font-display text-6xl mb-6">
            {photographer.name[0]}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-bold">{photographer.name}</h1>
            {photographer.is_verified && <span className="badge bg-teal/10 text-teal">Verified</span>}
          </div>
          <p className="text-ink/50 mb-3">{photographer.location} · {photographer.experience} years experience</p>
          <div className="flex items-center gap-2 mb-6">
            <RatingStars value={photographer.rating} />
            <span className="text-sm text-ink/60">{photographer.rating} ({reviews.length} reviews)</span>
          </div>
          <p className="text-ink/70 leading-relaxed mb-10">{photographer.bio}</p>

          <h2 className="font-display text-xl font-semibold mb-4">Packages</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {pkgs.map((pkg) => (
              <div key={pkg.package_id} className="card p-5">
                <h3 className="font-semibold mb-1">{pkg.name}</h3>
                <p className="text-sm text-ink/60 mb-3">{pkg.description}</p>
                <p className="text-xs text-ink/50 mb-3">{pkg.features}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-brass">{formatCurrency(pkg.price)}</p>
                  <button className="btn-outline !px-4 !py-2 text-sm" onClick={() => setBookingPkg(pkg)}>Book</button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {portfolioItems.map((item) => (
              <div key={item.portfolio_id} className="aspect-square rounded-xl bg-gradient-to-br from-brass/20 to-teal/20 flex items-center justify-center text-xs text-ink/50 text-center p-2">
                {item.title}
              </div>
            ))}
          </div>

          <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.length === 0 && <p className="text-sm text-ink/50">No reviews yet.</p>}
            {reviews.map((r) => (
              <div key={r.review_id} className="card p-4">
                <RatingStars value={r.rating} />
                <p className="text-sm text-ink/70 mt-2">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card p-5 sticky top-24">
            <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Starting from</p>
            <p className="font-display text-2xl font-bold text-brass mb-4">{formatCurrency(photographer.price_per_hour)} / hr</p>
            <button className="btn-primary w-full" onClick={() => setBookingPkg(pkgs[0])} disabled={pkgs.length === 0}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={!!bookingPkg}
        onClose={() => setBookingPkg(null)}
        title={`Book: ${bookingPkg?.name || ''}`}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setBookingPkg(null)}>Cancel</button>
            <button className="btn-primary" onClick={confirmBooking} disabled={!form.event_date || !form.location}>
              Confirm Booking
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Event date" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          <Input label="Preferred time" placeholder="e.g. 10:00 AM" value={form.booking_time} onChange={(e) => setForm({ ...form, booking_time: e.target.value })} />
          <Input label="Location" placeholder="Venue / address" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Textarea label="Special requirements (optional)" value={form.special_requirements} onChange={(e) => setForm({ ...form, special_requirements: e.target.value })} />
          {bookingPkg && <p className="text-sm text-ink/60">Package total: <strong className="text-ink">{formatCurrency(bookingPkg.price)}</strong></p>}
        </div>
      </Modal>
    </div>
  )
}
