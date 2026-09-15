'use client'

import { useState, useCallback, useEffect } from 'react'
import { ROLES, ROLE_PROFILES } from '../constants'
import { can, loginWithApi, logoutApi } from '../services/authService'

export function useAuth(initialRole = ROLES.ADMIN) {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeRole, setActiveRole] = useState(initialRole)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Restauration de session au montage du composant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token')
      const storedProfile = localStorage.getItem('user_profile')

      if (storedToken && storedProfile) {
        try {
          const parsedUser = JSON.parse(storedProfile)
          setUser(parsedUser)
          setActiveRole(parsedUser.roleUi || ROLES.ADMIN)
          setAuthenticated(true)
        } catch (e) {
          logoutApi()
        }
      }
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { user: userData } = await loginWithApi(email, password)
      if (userData) {
        setUser(userData)
        setActiveRole(userData.roleUi)
      }
      setAuthenticated(true)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  // Mode Démo rapide
  const loginDemo = useCallback((role = ROLES.ADMIN) => {
    setActiveRole(role)
    setAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    logoutApi()
    setUser(null)
    setAuthenticated(false)
  }, [])

  const switchRole = useCallback((role) => {
    if (ROLE_PROFILES[role]) {
      setActiveRole(role)
    }
  }, [])

  const checkPermission = useCallback(
    (capability) => can(activeRole, capability),
    [activeRole]
  )

  return {
    authenticated,
    activeRole,
    user,
    loading,
    error,
    currentProfile: user
      ? { name: user.nom, email: user.email, label: user.roleBackend, initials: user.nom.slice(0, 2).toUpperCase() }
      : ROLE_PROFILES[activeRole] || ROLE_PROFILES.admin,
    login,
    loginDemo,
    logout,
    switchRole,
    can: checkPermission,
  }
}