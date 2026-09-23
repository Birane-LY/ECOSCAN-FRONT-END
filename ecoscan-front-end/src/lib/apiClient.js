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

    throw new Error(
      body.detail ||
      body.error ||
      `Erreur ${res.status} sur ${url}`
    )
  }

  const data = await res.json()

  return data.results ?? data
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
          .map(
            ([champ, msgs]) =>
              `${champ}: ${
                Array.isArray(msgs)
                  ? msgs.join(', ')
                  : msgs
              }`
          )
          .join(' | ')
      }
    }

    throw new Error(
      message || `Erreur ${response.status} sur ${url}`
    )
  }

  return response.json()
}