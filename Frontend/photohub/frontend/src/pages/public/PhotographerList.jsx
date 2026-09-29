import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { photographerService } from '../../services/photographerService'
import RatingStars from '../../components/common/RatingStars'
import Select from '../../components/forms/Select'
import Input from '../../components/forms/Input'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/helpers'
import { CATEGORIES } from '../../constants'

export default function PhotographerList() {
  const [params, setParams] = useSearchParams()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const category = params.get('category') || ''

  useEffect(() => {
    setLoading(true)
    photographerService.getAll({ category, search }).then((data) => {
      setList(data)
      setLoading(false)
    })
  }, [category, search])

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Find Photographers</h1>
      <p className="text-ink/60 mb-8">Browse verified professionals by category, location and price.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input placeholder="Search by name or bio..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select
          value={category}
          onChange={(e) => setParams(e.target.value ? { category: e.target.value } : {})}
          options={[{ value: '', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
          className="sm:max-w-xs"
        />
      </div>

      {loading ? (
        <Loader label="Finding photographers..." />
      ) : list.length === 0 ? (
        <EmptyState title="No photographers found" message="Try a different search or category." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <Link to={`/photographers/${p.photographer_id}`} key={p.photographer_id} className="card overflow-hidden group">
              <div className="h-36 bg-gradient-to-br from-ink to-teal flex items-center justify-center text-paper/30 font-display text-3xl">
                {p.name[0]}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold group-hover:text-brass transition-colors">{p.name}</h3>
                  {p.is_verified && <span className="badge bg-teal/10 text-teal">Verified</span>}
                </div>
                <p className="text-xs text-ink/50 mb-2">{p.location} · {p.category}</p>
                <div className="flex items-center gap-2 mb-3">
                  <RatingStars value={p.rating} />
                  <span className="text-xs text-ink/50">{p.rating} ({p.experience} yrs exp.)</span>
                </div>
                <p className="text-sm font-semibold text-brass">{formatCurrency(p.price_per_hour)} / hr</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
