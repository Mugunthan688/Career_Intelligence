import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, getRole } from '../utils/auth'

/**
 * ProtectedRoute
 *
 * Usage:
 *   <ProtectedRoute>            ← any logged-in user
 *   <ProtectedRoute roles={['admin']}>  ← admin only
 */
const ProtectedRoute = ({ children, roles }) => {
  /* Not logged in → redirect to login */
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  /* Role restriction → redirect to dashboard */
  if (roles && roles.length > 0) {
    const userRole = getRole()
    if (!roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute