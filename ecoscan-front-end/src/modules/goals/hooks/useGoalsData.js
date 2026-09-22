'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPatch } from '@/lib/apiClient'

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