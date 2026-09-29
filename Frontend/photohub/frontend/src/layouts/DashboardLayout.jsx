import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/helpers'

export default function DashboardLayout({ items = [], title = 'Dashboard' }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-paper">
      <div className="hidden lg:block">
        <Sidebar items={items} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <Sidebar items={items} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-black/5 bg-white flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-xl" onClick={() => setMobileOpen(true)} aria-label="Open menu">☰</button>
            <h1 className="font-display text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink/60 hidden sm:inline">{user?.name}</span>
            <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-semibold">
              {initials(user?.name || '')}
            </div>
            <button onClick={() => { logout(); navigate('/') }} className="btn-outline !px-4 !py-2 text-sm">Logout</button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
