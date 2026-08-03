import { useState, useCallback } from 'react'
import { getToken, getRole, getName, clearToken, isAuthenticated } from '../utils/auth'

const useAuth = () => {
  const [state, setState] = useState({
    token:           getToken(),
    role:            getRole(),
    name:            getName(),
    isAuthenticated: isAuthenticated(),
  })

  /* Re-read from localStorage (call after login) */
  const refresh = useCallback(() => {
    setState({
      token:           getToken(),
      role:            getRole(),
      name:            getName(),
      isAuthenticated: isAuthenticated(),
    })
  }, [])

  /* Clear everything and redirect */
  const logout = useCallback(() => {
    clearToken()
    setState({ token:null, role:null, name:null, isAuthenticated:false })
  }, [])

  return { ...state, refresh, logout }
}

export default useAuth