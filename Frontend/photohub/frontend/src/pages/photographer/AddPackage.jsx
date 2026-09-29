import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { packageService } from '../../services/packageService'
import { getPhotographerByUserId } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/forms/Input'
import Textarea from '../../components/forms/Textarea'

export default function AddPackage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_hours: '', features: '' })
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    await packageService.create({ photographer_id: photographer.photographer_id, ...form, price: Number(form.price), duration_hours: Number(form.duration_hours) })
    addToast('Package created.', 'success')
    navigate('/photographer/packages')
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-xl font-semibold mb-6">Add Package</h2>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <Input label="Package name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Textarea label="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (₹)" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="Duration (hours)" type="number" required value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} />
        </div>
        <Textarea label="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <button className="btn-primary w-full" disabled={saving}>{saving ? 'Creating...' : 'Create package'}</button>
      </form>
    </div>
  )
}
