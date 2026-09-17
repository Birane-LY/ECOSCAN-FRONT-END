'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

async function apiPatch(path, body) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || JSON.stringify(err) || `Erreur ${res.status}`)
  }
  return res.json()
}

export function useGoalsData() {
  const [state, setState] = useState({ loading: true, error: null, objectifs: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const objectifs = await apiGet('/energies/objectifs/')
      setState({ loading: false, error: null, objectifs })
    } catch (err) {
      setState({ loading: false, error: err.message, objectifs: [] })
    }
  }, [])

  const updateObjectif = useCallback(async (id, valeur_cible) => {
    await apiPatch(`/energies/objectifs/${id}/`, { valeur_cible })
    await reload()
  }, [reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, updateObjectif }
}