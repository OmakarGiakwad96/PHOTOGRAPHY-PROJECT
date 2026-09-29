export default function About() {
  return (
    <div className="container-page py-20 max-w-3xl">
      <p className="uppercase tracking-[0.3em] text-brass text-xs font-semibold mb-4">About PhotoHub</p>
      <h1 className="font-display text-4xl font-bold mb-6">We built the booking layer photography needed.</h1>
      <p className="text-ink/70 leading-relaxed mb-4">
        PhotoHub started as a simple idea: finding, vetting and booking a professional photographer
        shouldn't involve endless DMs and guesswork. We built a platform where clients can browse
        verified photographers by category and location, compare packages transparently, and pay
        securely — while photographers get a dashboard to manage bookings, portfolios and earnings.
      </p>
      <p className="text-ink/70 leading-relaxed mb-4">
        Every photographer on PhotoHub goes through a verification step before their profile is
        marked "Verified", and every payment is tracked end-to-end, including refunds when a booking
        doesn't work out.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 mt-10">
        {[
          { label: 'Verified photographers', value: '250+' },
          { label: 'Bookings completed', value: '4,300+' },
          { label: 'Cities covered', value: '18' },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <p className="font-display text-3xl font-bold text-brass">{s.value}</p>
            <p className="text-xs text-ink/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
