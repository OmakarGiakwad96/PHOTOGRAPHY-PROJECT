import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('photohub_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (_) {
        localStorage.removeItem('photohub_user')
      }
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const { token, user: loggedInUser } = await authService.login(email, password)
    localStorage.setItem('photohub_token', token)
    localStorage.setItem('photohub_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(payload) {
    const { token, user: newUser } = await authService.register(payload)
    localStorage.setItem('photohub_token', token)
    localStorage.setItem('photohub_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  function logout() {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
