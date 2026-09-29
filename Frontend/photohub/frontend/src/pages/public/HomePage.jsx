import { Link } from 'react-router-dom'
import { photographers, packages } from '../../data/mockData'
import RatingStars from '../../components/common/RatingStars'
import { formatCurrency } from '../../utils/helpers'
import { CATEGORIES } from '../../constants'

export default function Home() {
  const featured = photographers.slice(0, 3)
  const topPackages = packages.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="absolute -right-24 -top-24 opacity-20">
          <svg width="500" height="500" viewBox="0 0 40 40" className="aperture-spin">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#B9893E" strokeWidth="0.5" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path key={deg} d="M20 6 L27 20 L20 20 Z" fill="#B9893E" transform={`rotate(${deg} 20 20)`} />
            ))}
          </svg>
        </div>
        <div className="container-page relative py-24 sm:py-32">
          <p className="uppercase tracking-[0.3em] text-brass text-xs font-semibold mb-5">Book verified photographers</p>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold max-w-2xl leading-[1.05]">
            Every moment deserves a professional eye.
          </h1>
          <p className="mt-6 max-w-lg text-paper/70 text-lg">
            PhotoHub matches you with vetted photographers for weddings, portraits, events and more —
            compare packages, book instantly, pay securely.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/photographers" className="btn-primary !bg-brass !text-ink hover:!bg-paper">Find a Photographer</Link>
            <Link to="/register" className="btn-outline !border-paper/30 !text-paper hover:!border-brass hover:!text-brass">Join as a Photographer</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <h2 className="font-display text-2xl font-bold mb-6">Browse by category</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/photographers?category=${c}`} className="px-4 py-2 rounded-full border border-black/10 text-sm font-medium hover:border-brass hover:text-brass transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured photographers */}
      <section className="container-page py-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Featured photographers</h2>
          <Link to="/photographers" className="text-sm text-brass font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <Link to={`/photographers/${p.photographer_id}`} key={p.photographer_id} className="card overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-ink to-teal flex items-center justify-center text-paper/30 font-display text-3xl">
                {p.name[0]}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-semibold group-hover:text-brass transition-colors">{p.name}</h3>
                  {p.is_verified && <span className="badge bg-teal/10 text-teal">Verified</span>}
                </div>
                <p className="text-xs text-ink/50 mb-2">{p.location}</p>
                <div className="flex items-center gap-2 mb-3">
                  <RatingStars value={p.rating} />
                  <span className="text-xs text-ink/50">{p.rating}</span>
                </div>
                <p className="text-sm font-semibold text-brass">{formatCurrency(p.price_per_hour)} / hr</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Popular packages</h2>
          <Link to="/packages" className="text-sm text-brass font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPackages.map((pkg) => (
            <div key={pkg.package_id} className="card p-5">
              <h3 className="font-display font-semibold mb-1">{pkg.name}</h3>
              <p className="text-sm text-ink/60 mb-3">{pkg.description}</p>
              <p className="text-brass font-bold">{formatCurrency(pkg.price)}</p>
              <p className="text-xs text-ink/40">{pkg.duration_hours} hrs coverage</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal text-paper">
        <div className="container-page py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Are you a photographer?</h2>
          <p className="text-paper/70 mb-6 max-w-md mx-auto">List your packages, manage bookings and get paid — all from one dashboard.</p>
          <Link to="/register" className="btn-primary !bg-brass !text-ink hover:!bg-paper">Join PhotoHub</Link>
        </div>
      </section>
    </div>
  )
}
