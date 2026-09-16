'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, API_PREFIX } from '@/lib/apiClient'

export function useGoalsData() {
  const [state, setState] = useState({ loading: true, error: null, objectifs: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
    const objectifs = await apiGet(`${API_PREFIX.ENERGIES}/objectifs/`)
      setState({ loading: false, error: null, objectifs })
    } catch (err) {
      setState({ loading: false, error: err.message, objectifs: [] })
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}