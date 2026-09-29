import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { packages, photographers } from '../../data/mockData'
import { formatCurrency } from '../../utils/helpers'
import Loader from '../../components/common/Loader'

export default function PackageDetails() {
  const { id } = useParams()
  const [pkg, setPkg] = useState(undefined)

  useEffect(() => {
    setPkg(packages.find((p) => p.package_id === Number(id)) || null)
  }, [id])

  if (pkg === undefined) return <Loader />
  if (pkg === null) return <div className="container-page py-20 text-center">Package not found.</div>

  const photographer = photographers.find((p) => p.photographer_id === pkg.photographer_id)

  return (
    <div className="container-page py-14 max-w-2xl">
      <p className="text-xs text-ink/40 mb-2">Package</p>
      <h1 className="font-display text-3xl font-bold mb-4">{pkg.name}</h1>
      <p className="text-ink/70 mb-6">{pkg.description}</p>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-2xl font-bold text-brass">{formatCurrency(pkg.price)}</p>
          <p className="text-sm text-ink/50">{pkg.duration_hours} hrs coverage</p>
        </div>
        <p className="text-sm text-ink/60"><strong>Includes:</strong> {pkg.features}</p>
      </div>

      {photographer && (
        <Link to={`/photographers/${photographer.photographer_id}`} className="card p-5 flex items-center justify-between hover:border-brass border border-transparent">
          <div>
            <p className="text-xs text-ink/40">Offered by</p>
            <p className="font-semibold">{photographer.name}</p>
          </div>
          <span className="text-brass text-sm font-medium">View profile →</span>
        </Link>
      )}
    </div>
  )
}
