/* ════════════════════════════════════════════════
   api.js — Axios instance
   Uses getToken() from auth.js (ci_token key)
════════════════════════════════════════════════ */
import axios from 'axios'
import { getToken, clearToken } from './auth'

const api = axios.create({
  baseURL: 'http://localhost:8000',
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
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and redirect
      clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api