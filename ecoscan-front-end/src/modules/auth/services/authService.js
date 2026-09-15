import { ROLES, mapRoleToFront } from '../constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Tente la connexion auprès du backend Django JWT
 */
export async function loginWithApi(email, password) {
  const response = await fetch(`${API_URL}/auth/connexion/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    const errorMsg = errorData.detail || 'Identifiants incorrects'
    throw new Error(errorMsg)
  }

  const data = await response.json()
  
  // Stockage des tokens JWT
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
  }

  // Décodage sommaire du payload JWT pour extraire les infos
  try {
    const payloadBase64 = data.access.split('.')[1]
    const decoded = JSON.parse(atob(payloadBase64))
    
    const uiRole = mapRoleToFront(decoded.role)
    const userProfile = {
      id: decoded.user_id,
      email: decoded.email || email,
      nom: decoded.nom || 'Utilisateur',
      roleBackend: decoded.role,
      roleUi: uiRole,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(userProfile))
    }

    return { tokens: data, user: userProfile }
  } catch (e) {
    // Si le token ne contient pas directement le profil
    return { tokens: data, user: null }
  }
}

/**
 * Déconnexion utilisateur
 */
export function logoutApi() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_profile')
  }
}

/**
 * Rafraîchit le token JWT
 */
export async function refreshTokenApi() {
  const refresh = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
  if (!refresh) return null

  const response = await fetch(`${API_URL}/auth/rafraichir/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (response.ok) {
    const data = await response.json()
    localStorage.setItem('access_token', data.access)
    return data.access
  } else {
    logoutApi()
    return null
  }
}

/**
 * Demande d'onboarding autonome (Admin Org)
 */
export async function requestOnboardingApi(nomAdmin, emailConnexion) {
  const response = await fetch(`${API_URL}/onboarding/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom_admin: nomAdmin,
      email_connexion: emailConnexion,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.email_connexion?.[0] || data.nom_admin?.[0] || 'Erreur lors de la demande d’inscription')
  }
  return data
}

/**
 * Finalisation de l'inscription via lien unique/token
 */
export async function finalizeActivationApi(uid, token, motDePasse) {
  const response = await fetch(`${API_URL}/activation/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid,
      token,
      mot_de_passe: motDePasse,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.mot_de_passe?.[0] || data.detail || 'Erreur lors de l’activation')
  }
  return data
}

/**
 * Vérification des permissions locales UI
 */
export function can(role, capability) {
  if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN_ORGANISATION) return true
  if ((role === ROLES.OPS || role === ROLES.UTILISATEUR_ORGANISATION) && capability === 'edit') return true
  return false
}