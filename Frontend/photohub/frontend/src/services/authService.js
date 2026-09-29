import { api } from '../utils/api'
import { withFallback } from './_demoMode'
import { users } from '../data/mockData'

export const authService = {
  login: (email, password) =>
    withFallback(
      () => api.post('/auth/login', { email, password }),
      (() => {
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (!found) throw new Error('No account found with that email in demo data.')
        return { token: 'demo-token', user: found }
      })()
    ),

  register: (payload) =>
    withFallback(
      () => api.post('/auth/register', payload),
      { token: 'demo-token', user: { user_id: Date.now(), status: 'active', ...payload } }
    ),

  forgotPassword: (email) =>
    withFallback(() => api.post('/auth/forgot-password', { email }), { message: 'Reset link sent (demo mode).' }),

  resetPassword: (token, password) =>
    withFallback(() => api.post('/auth/reset-password', { token, password }), { message: 'Password reset (demo mode).' }),

  logout: () => {
    localStorage.removeItem('photohub_token')
    localStorage.removeItem('photohub_user')
  },
}
