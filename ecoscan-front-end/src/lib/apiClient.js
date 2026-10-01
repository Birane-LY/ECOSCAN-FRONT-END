const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const API_PREFIX = {
  ACCOUNTS: '',
  ORGANISATIONS: '/organisations',
  ENERGIES: '/energies',
  ANALYSES: '/analyses',
}

function authHeaders() {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null

  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
}

function buildUrl(path) {
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export async function apiGet(path) {
  const url = buildUrl(path)

  console.log('[API GET]', url)

  const res = await fetch(url, {
    headers: authHeaders(),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))

    const error = new Error(
      body.detail ||
        body.error ||
        `Erreur ${res.status} sur ${url}`
    )

    error.response = {
      status: res.status,
      data: body,
    }

    throw error
  }

  const data = await res.json()

  return data.results ?? data
}

export async function apiGetAll(path) {
  const initialUrl = new URL(buildUrl(path))
  const origin = initialUrl.origin
  const visited = new Set()
  const items = []
  let nextUrl = initialUrl

  while (nextUrl) {
    if (nextUrl.origin !== origin || visited.has(nextUrl.href)) {
      throw new Error('La pagination du serveur contient une URL invalide.')
    }
    visited.add(nextUrl.href)

    const response = await fetch(nextUrl.href, { headers: authHeaders() })
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.detail || body.error || `Erreur ${response.status} lors du chargement des données.`)
    }

    const data = await response.json()
    if (Array.isArray(data)) {
      items.push(...data)
      nextUrl = null
      continue
    }
    if (!Array.isArray(data.results)) {
      throw new Error('Réponse paginée inattendue du serveur.')
    }

    items.push(...data.results)
    nextUrl = data.next ? new URL(data.next, nextUrl) : null
  }

  return items
}

export async function apiDownload(path) {
  const url = buildUrl(path)
  const response = await fetch(url, { headers: authHeaders() })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || body.error || `Erreur ${response.status} sur ${url}`)
  }

  return response.blob()
}

export async function apiPost(path, body = {}, options = {}) {
  const url = buildUrl(path)

  console.log('[API POST]', url)

  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    let message = ''

    if (
      typeof errorData === 'object' &&
      errorData !== null
    ) {
      if (errorData.detail) {
        message = errorData.detail
      } else if (errorData.error) {
        message = errorData.error
      } else {
        message = Object.entries(errorData)
          .map(([champ, msgs]) => {
            const valeurs = Array.isArray(msgs)
              ? msgs.join(', ')
              : msgs

            return `${champ}: ${valeurs}`
          })
          .join(' | ')
      }
    }

    const error = new Error(
      message || `Erreur ${response.status} sur ${url}`
    )

    error.response = {
      status: response.status,
      data: errorData,
    }

    throw error
  }

  return response.json()
}

export async function apiUpload(path, formData, options = {}) {
  const url = buildUrl(path)
  const response = await fetch(url, {
    ...options,
    method: 'POST',
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const detail = errorData.detail || errorData.error
    const message = typeof detail === 'string'
      ? detail
      : Object.values(errorData)
        .flatMap((messages) => Array.isArray(messages) ? messages : [messages])
        .find((value) => typeof value === 'string')
    throw new Error(message || `Erreur ${response.status} lors de l’envoi du fichier.`)
  }

  return response.json()
}

/**
 * Active un compte invité.
 *
 * Endpoint Django :
 * POST /api/activation/
 *
 * Cette route est publique et ne nécessite pas de JWT.
 */
export async function activateAccount({
  uid,
  token,
  motDePasse,
  confirmationMotDePasse,
}) {
  return apiPost('/activation/', {
    uid,
    token,
    mot_de_passe: motDePasse,
    mot_de_passe_confirmation: confirmationMotDePasse,
  })
}

export async function apiPatch(path, body = {}) {
  const url = buildUrl(path)

  console.log('[API PATCH]', url)

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    const error = new Error(
      errorData.detail ||
        errorData.error ||
        `Erreur ${response.status} sur ${url}`
    )

    error.response = {
      status: response.status,
      data: errorData,
    }

    throw error
  }

  return response.json()
}

export async function apiDelete(path, options = {}) {
  const url = buildUrl(path)

  console.log('[API DELETE]', url)

  const response = await fetch(url, {
    ...options,
    method: 'DELETE',
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    const error = new Error(
      errorData.detail ||
        errorData.error ||
        `Erreur ${response.status} sur ${url}`
    )

    error.response = {
      status: response.status,
      data: errorData,
    }

    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json().catch(() => null)
}

export const apiClient = {
  async get(path) {
    const data = await apiGet(path)

    return {
      data,
    }
  },

  async post(path, body, options) {
    const data = await apiPost(path, body, options)

    return {
      data,
    }
  },

  async patch(path, body) {
    const data = await apiPatch(path, body)

    return {
      data,
    }
  },

  async delete(path, options) {
    const data = await apiDelete(path, options)

    return {
      data,
    }
  },
}

export default apiClient