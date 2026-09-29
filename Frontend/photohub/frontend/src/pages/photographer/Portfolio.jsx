import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { portfolioService } from '../../services/portfolioService'
import { getPhotographerByUserId } from '../../data/mockData'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ConfirmModal from '../../components/modals/ConfirmModal'
import { useToast } from '../../context/ToastContext'

export default function PhotographerPortfolio() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    portfolioService.getByPhotographer(photographer.photographer_id).then((data) => { setItems(data); setLoading(false) })
  }, [photographer.photographer_id])

  async function remove() {
    await portfolioService.remove(toDelete.portfolio_id)
    setItems((prev) => prev.filter((i) => i.portfolio_id !== toDelete.portfolio_id))
    addToast('Portfolio item removed.', 'success')
    setToDelete(null)
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">My Portfolio</h2>
        <Link to="/photographer/portfolio/add" className="btn-primary">+ Add Image</Link>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No portfolio images yet" message="Add your best work to attract more bookings." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.portfolio_id} className="relative group">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-brass/20 to-teal/20 flex items-center justify-center text-center text-xs text-ink/50 p-2">
                {item.title}
              </div>
              <button
                onClick={() => setToDelete(item)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-rose-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete"
              >
                ✕
              </button>
              <p className="text-xs text-ink/50 mt-1 text-center">{item.category}</p>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} title="Remove image?" message="This portfolio image will be removed." confirmLabel="Remove" danger />
    </div>
  )
}
