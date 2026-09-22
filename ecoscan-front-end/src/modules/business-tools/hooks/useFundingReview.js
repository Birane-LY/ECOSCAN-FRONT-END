'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

export function useFundingReview() {
  const [state, setState] = useState({ loading: true, error: null, aVerifier: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const aVerifier = await apiGet('/analyses/opportunites-financement/?statut=A_VERIFIER')
      setState({ loading: false, error: null, aVerifier })
    } catch (err) {
      setState({ loading: false, error: err.message, aVerifier: [] })
    }
  }, [])

  const valider = useCallback(async (id) => {
    await apiPost(`/analyses/opportunites-financement/${id}/valider/`)
    await reload()
  }, [reload])

  const rejeter = useCallback(async (id) => {
    await apiPost(`/analyses/opportunites-financement/${id}/rejeter/`)
    await reload()
  }, [reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, valider, rejeter }
}