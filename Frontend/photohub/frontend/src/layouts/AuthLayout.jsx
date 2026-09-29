import { Link, Outlet } from 'react-router-dom'
import Logo from '../components/common/Logo'

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper p-10">
        <Link to="/"><Logo dark /></Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight mb-3">
            Every moment,<br /> framed by a professional.
          </h2>
          <p className="text-paper/60 max-w-sm">
            Join thousands of clients and photographers already using PhotoHub to plan,
            book and manage photography sessions end to end.
          </p>
        </div>
        <p className="text-xs text-paper/40">© {new Date().getFullYear()} PhotoHub</p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8"><Link to="/"><Logo /></Link></div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
