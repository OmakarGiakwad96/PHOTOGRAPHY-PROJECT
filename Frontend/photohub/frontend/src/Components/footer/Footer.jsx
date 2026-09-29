import { Link } from 'react-router-dom'
import Logo from '../common/Logo'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-page py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo dark />
          <p className="text-sm text-paper/60 mt-4 max-w-xs">
            PhotoHub connects clients with verified professional photographers for weddings,
            portraits, events and more — book, pay and manage it all in one place.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link to="/photographers" className="hover:text-brass">Find Photographers</Link></li>
            <li><Link to="/packages" className="hover:text-brass">Packages</Link></li>
            <li><Link to="/search" className="hover:text-brass">Search</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link to="/about" className="hover:text-brass">About</Link></li>
            <li><Link to="/contact" className="hover:text-brass">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-brass">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-paper/60">
            <li><Link to="/login" className="hover:text-brass">Log in</Link></li>
            <li><Link to="/register" className="hover:text-brass">Register</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10 py-5 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} PhotoHub. All rights reserved.
      </div>
    </footer>
  )
}
