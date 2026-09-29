import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { portfolioService } from '../../services/portfolioService'
import { getPhotographerByUserId } from '../../data/mockData'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import { CATEGORIES } from '../../constants'

export default function AddPortfolio() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const photographer = getPhotographerByUserId(user.user_id) || { photographer_id: 1 }
  const [form, setForm] = useState({ title: '', category: CATEGORIES[0], image_url: '' })
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    await portfolioService.add({ photographer_id: photographer.photographer_id, ...form })
    addToast('Portfolio image added.', 'success')
    navigate('/photographer/portfolio')
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-xl font-semibold mb-6">Add Portfolio Image</h2>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={CATEGORIES} />
        <Input label="Image URL" placeholder="https://..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <button className="btn-primary w-full" disabled={saving}>{saving ? 'Adding...' : 'Add to portfolio'}</button>
      </form>
    </div>
  )
}
