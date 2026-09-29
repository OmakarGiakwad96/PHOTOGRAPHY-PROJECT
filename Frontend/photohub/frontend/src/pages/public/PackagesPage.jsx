import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { packageService } from '../../services/packageService'
import { photographers } from '../../data/mockData'
import { formatCurrency } from '../../utils/helpers'
import Loader from '../../components/common/Loader'

export default function PackagesPage() {
  const [pkgs, setPkgs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    packageService.getAll().then((data) => { setPkgs(data); setLoading(false) })
  }, [])

  function photographerName(id) {
    return photographers.find((p) => p.photographer_id === id)?.name || 'PhotoHub Partner'
  }

  if (loading) return <Loader label="Loading packages..." />

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Photography Packages</h1>
      <p className="text-ink/60 mb-8">Transparent, all-inclusive pricing from verified photographers.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pkgs.map((pkg) => (
          <Link to={`/packages/${pkg.package_id}`} key={pkg.package_id} className="card p-5 hover:border-brass border border-transparent transition-colors">
            <p className="text-xs text-ink/40 mb-1">by {photographerName(pkg.photographer_id)}</p>
            <h3 className="font-display font-semibold mb-2">{pkg.name}</h3>
            <p className="text-sm text-ink/60 mb-4">{pkg.description}</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-brass">{formatCurrency(pkg.price)}</p>
              <p className="text-xs text-ink/40">{pkg.duration_hours} hrs</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
