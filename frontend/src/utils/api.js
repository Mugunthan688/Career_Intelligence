/* ════════════════════════════════════════════════
   api.js — Axios instance
   Uses getToken() from auth.js (ci_token key)
════════════════════════════════════════════════ */
import axios from 'axios'
import { getToken, clearToken } from './auth'

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const cleanBaseURL = rawBaseURL.trim().replace(/\/+$/, '')

const api = axios.create({
  baseURL: cleanBaseURL,
  timeout: 60000,                              // 60s timeout for heavy agent calls
  headers: { 'Content-Type': 'application/json' },
})

/* ── Attach JWT to every request ─────────────── */
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* ── Handle errors globally ──────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/')
    const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/register'

    if (error.response?.status === 401 && !isAuthRoute && !isLoginPage) {
      // Token expired or invalid on a protected page — clear and redirect
      clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api