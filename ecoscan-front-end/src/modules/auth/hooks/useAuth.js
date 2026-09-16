'use client'
import { useState, useCallback, useEffect } from 'react'
import { ROLES, ROLE_PROFILES } from '../constants'
import { can, loginWithApi, logoutApi, fetchMyOrganisations } from '../services/authService'

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeRole, setActiveRole] = useState(ROLES.UTILISATEUR_ORGANISATION)
  const [user, setUser] = useState(null)
  const [organisations, setOrganisations] = useState([])
  const [activeOrganisation, setActiveOrganisation] = useState(null)
  const [orgLoading, setOrgLoading] = useState(false)
  const [orgError, setOrgError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isSuperAdmin = activeRole === ROLES.SUPER_ADMIN

  const loadOrganisations = useCallback(async (role) => {
    if (role === ROLES.SUPER_ADMIN) {
      setOrganisations([]); setActiveOrganisation(null)
      return
    }
    setOrgLoading(true); setOrgError(null)
    try {
      const orgs = await fetchMyOrganisations()
      setOrganisations(orgs)
      setActiveOrganisation(orgs[0] || null)
    } catch (err) {
      setOrgError(err.message)
    } finally {
      setOrgLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedToken = localStorage.getItem('access_token')
    const storedProfile = localStorage.getItem('user_profile')
    if (storedToken && storedProfile) {
      try {
        const parsedUser = JSON.parse(storedProfile)
        setUser(parsedUser)
        setActiveRole(parsedUser.roleUi || ROLES.UTILISATEUR_ORGANISATION)
        setAuthenticated(true)
        loadOrganisations(parsedUser.roleUi)
      } catch {
        logoutApi()
      }
    }
  }, [loadOrganisations])

  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null)
    try {
      const { user: userData } = await loginWithApi(email, password)
      setUser(userData)
      setActiveRole(userData.roleUi)
      setAuthenticated(true)
      await loadOrganisations(userData.roleUi)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [loadOrganisations])

  const logout = useCallback(() => {
    logoutApi()
    setUser(null); setAuthenticated(false)
    setOrganisations([]); setActiveOrganisation(null)
  }, [])

  const switchOrganisation = useCallback((orgId) => {
    setActiveOrganisation((prev) => organisations.find((o) => o.id === orgId) || prev)
  }, [organisations])

  const switchRole = useCallback((role) => { if (ROLE_PROFILES[role]) setActiveRole(role) }, [])
  const checkPermission = useCallback((capability) => can(activeRole, capability), [activeRole])

  return {
    authenticated, activeRole, user, loading, error, isSuperAdmin,
    organisations, activeOrganisation, orgLoading, orgError,
    currentProfile: user
      ? { name: user.nom, email: user.email, label: ROLE_PROFILES[user.roleUi]?.label, initials: (user.nom || '?').slice(0, 2).toUpperCase() }
      : ROLE_PROFILES[activeRole] || ROLE_PROFILES.UTILISATEUR_ORGANISATION,
    login, logout, switchRole, switchOrganisation, can: checkPermission,
  }
}