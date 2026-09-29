import { NavLink, Link } from 'react-router-dom'
import Logo from '../common/Logo'

export default function Sidebar({ items = [], onClose }) {
  return (
    <aside className="w-64 shrink-0 bg-ink text-paper h-full flex flex-col">
      <div className="px-6 py-5 border-b border-paper/10">
        <Link to="/"><Logo dark /></Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brass text-ink' : 'text-paper/70 hover:bg-paper/10 hover:text-paper'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-paper/10">
        <Link to="/" className="text-xs text-paper/50 hover:text-paper">← Back to site</Link>
      </div>
    </aside>
  )
}
