import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { portfolio } from '../data/mockData'

export const portfolioService = {
  getByPhotographer: (photographerId) =>
    withFallback(() => api.get(`/photographers/${photographerId}/portfolio`), portfolio.filter((p) => p.photographer_id === Number(photographerId))),
  add: (payload) => withFallback(() => api.post('/portfolio', payload), { portfolio_id: Date.now(), ...payload }),
  remove: (id) => withFallback(() => api.del(`/portfolio/${id}`), { success: true }),
}
