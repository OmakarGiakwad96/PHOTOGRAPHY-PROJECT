export default function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg viewBox="0 0 40 40" className="w-8 h-8 aperture-spin" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#B9893E" strokeWidth="1.5" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M20 6 L27 20 L20 20 Z"
            fill="#B9893E"
            opacity="0.85"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}
        <circle cx="20" cy="20" r="6" fill={dark ? '#15181C' : '#F6F2EA'} stroke="#B9893E" strokeWidth="1" />
      </svg>
      <span className={`font-display text-xl font-bold tracking-tight ${dark ? 'text-paper' : 'text-ink'}`}>
        Photo<span className="text-brass">Hub</span>
      </span>
    </div>
  )
}
