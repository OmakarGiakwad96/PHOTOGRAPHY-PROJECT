import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/forms/Input'
import { photographers, packages } from '../../data/mockData'
import { formatCurrency } from '../../utils/helpers'
import EmptyState from '../../components/common/EmptyState'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const photographerResults = query
    ? photographers.filter((p) => p.name.toLowerCase().includes(query) || p.location.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
    : []
  const packageResults = query ? packages.filter((p) => p.name.toLowerCase().includes(query)) : []

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-bold mb-6">Search PhotoHub</h1>
      <Input
        autoFocus
        placeholder="Search photographers, locations, categories, packages..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-xl mb-10"
      />

      {!query && <EmptyState title="Start typing to search" message="Try a city, a category like 'Wedding', or a photographer's name." />}

      {query && photographerResults.length === 0 && packageResults.length === 0 && (
        <EmptyState title="No results" message={`Nothing matched "${q}".`} />
      )}

      {photographerResults.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-3">Photographers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {photographerResults.map((p) => (
              <Link key={p.photographer_id} to={`/photographers/${p.photographer_id}`} className="card p-4 hover:border-brass border border-transparent">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-ink/50">{p.location} · {p.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {packageResults.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold mb-3">Packages</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {packageResults.map((p) => (
              <Link key={p.package_id} to={`/packages/${p.package_id}`} className="card p-4 hover:border-brass border border-transparent">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-brass">{formatCurrency(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
