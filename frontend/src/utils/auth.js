/* ════════════════════════════════════════════════
   auth.js — Single source of truth for auth tokens
   ALL keys standardized to: ci_token, ci_role, ci_name
════════════════════════════════════════════════ */

const KEYS = {
  TOKEN: 'ci_token',
  ROLE:  'ci_role',
  NAME:  'ci_name',
}

/* ── Clear any old mismatched keys from previous
   versions that used different key names ──────── */
const OLD_KEYS = ['token', 'role', 'name', 'access_token', 'user_role', 'user_name']
const clearOldKeys = () => {
  OLD_KEYS.forEach(k => localStorage.removeItem(k))
}

/* ── Save token + user info after login ──────── */
export const saveToken = (token, role, name) => {
  clearOldKeys()                                  // remove any old keys first
  localStorage.setItem(KEYS.TOKEN, token)
  localStorage.setItem(KEYS.ROLE,  role)
  localStorage.setItem(KEYS.NAME,  name)
}

/* ── Read helpers ────────────────────────────── */
export const getToken = () => localStorage.getItem(KEYS.TOKEN)
export const getRole  = () => localStorage.getItem(KEYS.ROLE)
export const getName  = () => localStorage.getItem(KEYS.NAME)

/* ── Auth check ──────────────────────────────── */
export const isAuthenticated = () => {
  const token = localStorage.getItem(KEYS.TOKEN)
  return !!token && token.length > 10        // extra check — not just any value
}

/* ── Clear everything on logout ──────────────── */
export const clearToken = () => {
  localStorage.removeItem(KEYS.TOKEN)
  localStorage.removeItem(KEYS.ROLE)
  localStorage.removeItem(KEYS.NAME)
  clearOldKeys()                              // clean old keys too
}