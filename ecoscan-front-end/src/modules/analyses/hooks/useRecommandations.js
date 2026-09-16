'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

export function useRecommandations() {
  const [state, setState] = useState({ loading: true, error: null, recommandations: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const all = await apiGet('/analyses/recommandations/')
      const enAttente = all.filter((r) => r.statut !== 'DECIDEE')
      setState({ loading: false, error: null, recommandations: enAttente })
    } catch (err) {
      setState({ loading: false, error: err.message, recommandations: [] })
    }
  }, [])

  const decider = useCallback(async (id) => {
    await apiPost(`/analyses/recommandations/${id}/marquer-comme-decidee/`)
    await reload()
  }, [reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, decider }
}
