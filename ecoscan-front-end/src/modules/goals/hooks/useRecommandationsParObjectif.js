'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useRecommandationsParObjectif(objectifId) {
  const [state, setState] = useState({ loading: true, error: null, recommandations: [] })

  useEffect(() => {
    if (!objectifId) { setState({ loading: false, error: null, recommandations: [] }); return }
    setState((s) => ({ ...s, loading: true }))
    apiGet(`/analyses/recommandations/?objectif=${objectifId}`)
      .then((recommandations) => setState({ loading: false, error: null, recommandations }))
      .catch((err) => setState({ loading: false, error: err.message, recommandations: [] }))
  }, [objectifId])

  return state
}