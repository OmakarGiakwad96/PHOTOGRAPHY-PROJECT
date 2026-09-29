export default function StatCard({ label, value, hint, tone = 'ink' }) {
  const toneMap = {
    ink: 'text-ink',
    brass: 'text-brass',
    teal: 'text-teal',
    rose: 'text-rose-600',
  }
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">{label}</p>
      <p className={`font-display text-3xl font-bold ${toneMap[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-ink/50 mt-1">{hint}</p>}
    </div>
  )
}
