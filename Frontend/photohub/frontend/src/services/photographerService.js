import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { photographers } from '../data/mockData'

export const photographerService = {
  getAll: (filters = {}) =>
    withFallback(() => api.get('/photographers'), photographers.filter((p) => {
      if (filters.category && p.category !== filters.category) return false
      if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!p.name.toLowerCase().includes(s) && !p.bio.toLowerCase().includes(s)) return false
      }
      return true
    })),
  getById: (id) => withFallback(() => api.get(`/photographers/${id}`), photographers.find((p) => p.photographer_id === Number(id))),
  create: (payload) => withFallback(() => api.post('/photographers', payload), { photographer_id: Date.now(), is_verified: false, ...payload }),
  update: (id, payload) => withFallback(() => api.put(`/photographers/${id}`, payload), { photographer_id: id, ...payload }),
  verify: (id) => withFallback(() => api.patch(`/photographers/${id}/verify`, { is_verified: true }), { photographer_id: id, is_verified: true }),
  softDelete: (id) => withFallback(() => api.del(`/photographers/${id}`), { success: true }),
}
