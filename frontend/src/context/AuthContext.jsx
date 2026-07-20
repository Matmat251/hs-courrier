import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hssc_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (correo, password) => {
    const { data } = await api.post('/auth/login', { correo, password })
    localStorage.setItem('hssc_token', data.token)
    localStorage.setItem('hssc_user', JSON.stringify(data))
    setUser(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('hssc_token')
    localStorage.removeItem('hssc_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
