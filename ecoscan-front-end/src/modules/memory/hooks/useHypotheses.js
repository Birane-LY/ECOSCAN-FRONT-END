'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

export function useHypotheses() {
  const [state, setState] = useState({ loading: true, error: null, hypotheses: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const all = await apiGet('/analyses/hypotheses/')
      setState({ loading: false, error: null, hypotheses: all.filter((h) => h.statut === 'PROPOSEE') })
    } catch (err) {
      setState({ loading: false, error: err.message, hypotheses: [] })
    }
  }, [])

  const confirmer = useCallback(async (id, confiance) => {
    await apiPost(`/analyses/hypotheses/${id}/confirmer/`, { confiance })
    await reload()
  }, [reload])

  const rejeter = useCallback(async (id) => {
    await apiPost(`/analyses/hypotheses/${id}/rejeter/`)
    await reload()
  }, [reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, confirmer, rejeter }
}