import { useState } from 'react'

const faqs = [
  { q: 'How do I book a photographer?', a: 'Browse Find Photographers, open a profile, pick a package, and confirm your booking with the date, time and location.' },
  { q: 'How are payments handled?', a: 'Payments are processed securely and tracked against each booking. You can view your full history under Payment History.' },
  { q: 'Can I cancel a booking?', a: 'Yes, from My Bookings you can cancel a pending or confirmed booking. Eligible cancellations are refunded automatically.' },
  { q: 'How do photographers get verified?', a: 'Our admin team reviews each photographer profile and portfolio before marking them as Verified.' },
  { q: 'What if I have a payment issue?', a: 'Report it from Payment History — our support/admin team resolves payment issues within 48 hours.' },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <div className="container-page py-20 max-w-2xl">
      <p className="uppercase tracking-[0.3em] text-brass text-xs font-semibold mb-4">FAQ</p>
      <h1 className="font-display text-4xl font-bold mb-10">Frequently asked questions</h1>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={f.q} className="card p-0 overflow-hidden">
            <button
              className="w-full text-left px-5 py-4 flex justify-between items-center font-medium"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              {f.q}
              <span className="text-brass">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && <p className="px-5 pb-4 text-sm text-ink/60">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
