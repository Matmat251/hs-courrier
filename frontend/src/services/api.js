import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: adjuntar JWT en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hssc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: redirigir a login si el token expira (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hssc_token')
      localStorage.removeItem('hssc_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
