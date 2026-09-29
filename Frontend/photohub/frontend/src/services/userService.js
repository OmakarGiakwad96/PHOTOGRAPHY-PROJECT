import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { users } from '../data/mockData'

export const userService = {
  getAll: () => withFallback(() => api.get('/users'), users),
  getById: (id) => withFallback(() => api.get(`/users/${id}`), users.find((u) => u.user_id === Number(id))),
  update: (id, payload) => withFallback(() => api.put(`/users/${id}`, payload), { ...payload, user_id: id }),
  updateStatus: (id, status) => withFallback(() => api.patch(`/users/${id}/status`, { status }), { user_id: id, status }),
  softDelete: (id) => withFallback(() => api.del(`/users/${id}`), { success: true }),
}
