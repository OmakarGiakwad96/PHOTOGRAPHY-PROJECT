import { portfolio, photographers } from '../../data/mockData'
import { Link } from 'react-router-dom'

export default function PortfolioPage() {
  function photographerName(id) {
    return photographers.find((p) => p.photographer_id === id)?.name
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Portfolio Gallery</h1>
      <p className="text-ink/60 mb-8">A glimpse of work from photographers across PhotoHub.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {portfolio.map((item) => (
          <Link
            to={`/photographers/${item.photographer_id}`}
            key={item.portfolio_id}
            className="aspect-square rounded-xl bg-gradient-to-br from-brass/20 to-teal/20 flex flex-col items-center justify-center text-center p-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-sm font-medium text-ink/70">{item.title}</span>
            <span className="text-xs text-ink/40 mt-1">{photographerName(item.photographer_id)}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
