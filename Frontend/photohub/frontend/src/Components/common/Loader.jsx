export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink/60">
      <div className="w-8 h-8 border-2 border-brass border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
