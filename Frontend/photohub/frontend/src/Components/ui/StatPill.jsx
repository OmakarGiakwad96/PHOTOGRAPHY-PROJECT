export default function StatPill({ icon, label, value }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-brass/15 text-brass flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
        <p className="font-display text-xl font-bold leading-tight">{value}</p>
      </div>
    </div>
  )
}
