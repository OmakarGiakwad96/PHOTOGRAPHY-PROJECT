import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import { useAuth } from '../../context/AuthContext'
import { initials } from '../../utils/helpers'

const links = [
  { to: '/photographers', label: 'Find Photographers' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function dashboardPath() {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'photographer') return '/photographer/dashboard'
    return '/customer/dashboard'
  }

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-black/5">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/"><Logo /></Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-brass' : 'text-ink/70 hover:text-ink'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(dashboardPath())} className="btn-ghost">Dashboard</button>
              <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-semibold">
                {initials(user.name)}
              </div>
              <button onClick={() => { logout(); navigate('/') }} className="btn-outline !px-4 !py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden container-page pb-4 flex flex-col gap-3 border-t border-black/5 pt-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <button className="btn-outline w-full" onClick={() => { setOpen(false); navigate(dashboardPath()) }}>Dashboard</button>
              <button className="btn-primary w-full" onClick={() => { logout(); setOpen(false); navigate('/') }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline w-full text-center">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
