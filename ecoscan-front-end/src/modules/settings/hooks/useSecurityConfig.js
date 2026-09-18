'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function apiPatchOrg(path, body) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Erreur ${res.status}`)
  }
  return res.json()
}

export function useSecurityConfig() {
  const [state, setState] = useState({ loading: true, error: null, config: null })

  const reload = useCallback(async () => {
    try {
      const config = await apiGet('/organisations/configuration-securite/')
      setState({ loading: false, error: null, config })
    } catch (err) {
      setState({ loading: false, error: err.message, config: null })
    }
  }, [])

  const updateConfig = useCallback(async (patch) => {
    const config = await apiPatchOrg('/organisations/configuration-securite/', patch)
    setState((s) => ({ ...s, config }))
    return config
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, updateConfig }
}