'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function apiPatch(path, body) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Erreur ${res.status}`)
  return res.json()
}

export function usePreferences() {
  const [state, setState] = useState({ loading: true, error: null, preferences: null })

  const reload = useCallback(async () => {
    try {
      const preferences = await apiGet('/mes-preferences/')
      setState({ loading: false, error: null, preferences })
    } catch (err) {
      setState({ loading: false, error: err.message, preferences: null })
    }
  }, [])

  const updatePreferences = useCallback(async (patch) => {
    // 1. Mise à jour optimiste immédiate de l'état UI
    setState((s) => ({
      ...s,
      preferences: s.preferences ? { ...s.preferences, ...patch } : patch,
    }))

    try {
      // 2. Persistance de la mise à jour côté serveur
      const updatedPreferences = await apiPatch('/mes-preferences/', patch)
      
      // 3. Réalignement avec la donnée confirmée par le serveur
      setState((s) => ({ ...s, preferences: updatedPreferences }))
      return updatedPreferences
    } catch (err) {
      // Restauration de l'état en cas d'erreur API
      reload()
      throw err
    }
  }, [reload])

  useEffect(() => { reload() }, [reload])
  
  return { ...state, reload, updatePreferences }
}