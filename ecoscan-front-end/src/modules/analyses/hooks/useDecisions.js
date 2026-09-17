'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useDecisions() {
  const [state, setState] = useState({ loading: true, error: null, decisions: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const decisions = await apiGet('/analyses/decisions/')
      setState({ loading: false, error: null, decisions })
    } catch (err) {
      setState({ loading: false, error: err.message, decisions: [] })
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}