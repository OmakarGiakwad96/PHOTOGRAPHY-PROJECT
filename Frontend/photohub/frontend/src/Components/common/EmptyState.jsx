export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="text-center py-16 px-4 border border-dashed border-black/10 rounded-2xl">
      <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
      {message && <p className="text-sm text-ink/60 max-w-sm mx-auto mb-4">{message}</p>}
      {action}
    </div>
  )
}
