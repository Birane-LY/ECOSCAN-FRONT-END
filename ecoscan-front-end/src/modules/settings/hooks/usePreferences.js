'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPatch } from '@/lib/apiClient'

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