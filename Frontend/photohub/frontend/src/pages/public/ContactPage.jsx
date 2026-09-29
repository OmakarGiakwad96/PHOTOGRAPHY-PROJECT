import { useState } from 'react'
import Input from '../../components/forms/Input'
import Textarea from '../../components/forms/Textarea'
import { useToast } from '../../context/ToastContext'

export default function Contact() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function submit(e) {
    e.preventDefault()
    addToast('Message sent! We will get back to you soon.', 'success')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="container-page py-20 grid md:grid-cols-2 gap-14">
      <div>
        <p className="uppercase tracking-[0.3em] text-brass text-xs font-semibold mb-4">Contact</p>
        <h1 className="font-display text-4xl font-bold mb-6">Let's talk.</h1>
        <p className="text-ink/70 mb-8">Questions about bookings, payments or partnering with PhotoHub? Reach out.</p>
        <div className="space-y-3 text-sm text-ink/70">
          <p>📧 support@photohub.example</p>
          <p>📞 +91 98765 00000</p>
          <p>📍 Mumbai, Maharashtra, India</p>
        </div>
      </div>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Textarea label="Message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn-primary w-full" type="submit">Send message</button>
      </form>
    </div>
  )
}
