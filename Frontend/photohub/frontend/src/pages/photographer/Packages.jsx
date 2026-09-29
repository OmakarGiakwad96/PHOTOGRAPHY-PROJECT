import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { packageService } from '../../services/packageService'
import { getPhotographerByUserId } from '../../data/mockData'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import ConfirmModal from '../../components/modals/ConfirmModal'
import { formatCurrency } from '../../utils/helpers'
import { useToast } from '../../context/ToastContext'

export default function PhotographerPackages() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }
  const [pkgs, setPkgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    packageService.getByPhotographer(photographer.photographer_id).then((data) => { setPkgs(data); setLoading(false) })
  }, [photographer.photographer_id])

  async function remove() {
    await packageService.remove(toDelete.package_id)
    setPkgs((prev) => prev.filter((p) => p.package_id !== toDelete.package_id))
    addToast('Package removed.', 'success')
    setToDelete(null)
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">My Packages</h2>
        <Link to="/photographer/packages/add" className="btn-primary">+ Add Package</Link>
      </div>
      {pkgs.length === 0 ? (
        <EmptyState title="No packages yet" message="Create a package so clients can book you." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {pkgs.map((pkg) => (
            <div key={pkg.package_id} className="card p-5">
              <h3 className="font-semibold mb-1">{pkg.name}</h3>
              <p className="text-sm text-ink/60 mb-3">{pkg.description}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-brass">{formatCurrency(pkg.price)}</p>
                <button className="btn-ghost !text-rose-600 text-sm" onClick={() => setToDelete(pkg)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={remove} title="Remove package?" message="Clients will no longer be able to book this package." confirmLabel="Remove" danger />
    </div>
  )
}
