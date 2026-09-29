import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { packages } from '../data/mockData'

export const packageService = {
  getByPhotographer: (photographerId) =>
    withFallback(() => api.get(`/photographers/${photographerId}/packages`), packages.filter((p) => p.photographer_id === Number(photographerId))),
  getAll: () => withFallback(() => api.get('/packages'), packages),
  create: (payload) => withFallback(() => api.post('/packages', payload), { package_id: Date.now(), ...payload }),
  update: (id, payload) => withFallback(() => api.put(`/packages/${id}`, payload), { package_id: id, ...payload }),
  remove: (id) => withFallback(() => api.del(`/packages/${id}`), { success: true }),
}
