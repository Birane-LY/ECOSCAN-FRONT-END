// authService.js
import { ROLES } from '../constants'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function loginWithApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/connexion/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Email ou mot de passe incorrect.')
  }

  const data = await response.json()
  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)

  const payload = decodeJwtPayload(data.access) || {}
  const user = {
    id: payload.user_id,
    email: payload.email || email,
    nom: payload.nom || email.split('@')[0],
    roleUi: payload.role || ROLES.UTILISATEUR_ORGANISATION,
    roleBackend: payload.role,
  }
  localStorage.setItem('user_profile', JSON.stringify(user))
  return { user }
}

export function logoutApi() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_profile')
}

export function can(role, capability) {
  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN_ORGANISATION) return true
  if (role === ROLES.UTILISATEUR_ORGANISATION && capability === 'edit') return true
  return false
}

export async function fetchMyOrganisations() {
  const token = localStorage.getItem('access_token')
  const response = await fetch(`${API_BASE_URL}/organisations/structures/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error("Impossible de récupérer vos organisations.")
  const data = await response.json()
  return data.results ?? data
}