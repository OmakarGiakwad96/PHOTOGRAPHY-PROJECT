export function formatCurrency(amount) {
  const value = Number(amount || 0)
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}

export function classNames(...arr) {
  return arr.filter(Boolean).join(' ')
}

export function statusTone(status) {
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    success: 'bg-emerald-100 text-emerald-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    approved: 'bg-emerald-100 text-emerald-700',
    processed: 'bg-emerald-100 text-emerald-700',
    refunded: 'bg-emerald-100 text-emerald-700',

    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-amber-100 text-amber-700',
    requested: 'bg-amber-100 text-amber-700',
    processing: 'bg-amber-100 text-amber-700',
    in_review: 'bg-amber-100 text-amber-700',
    open: 'bg-amber-100 text-amber-700',

    cancelled: 'bg-rose-100 text-rose-700',
    rejected: 'bg-rose-100 text-rose-700',
    blocked: 'bg-rose-100 text-rose-700',
    failed: 'bg-rose-100 text-rose-700',
    denied: 'bg-rose-100 text-rose-700',
  }
  return map[status] || 'bg-black/5 text-ink/70'
}
