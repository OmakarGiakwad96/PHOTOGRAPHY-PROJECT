import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { reviews } from '../data/mockData'

export const reviewService = {
  getByPhotographer: (photographerId) => withFallback(() => api.get(`/photographers/${photographerId}/reviews`), reviews.filter((r) => r.photographer_id === Number(photographerId))),
  getByUser: (userId) => withFallback(() => api.get(`/users/${userId}/reviews`), reviews.filter((r) => r.user_id === Number(userId))),
  create: (payload) => withFallback(() => api.post('/reviews', payload), { review_id: Date.now(), ...payload }),
}
