'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useMemoiresStrategiques() {
  const [state, setState] = useState({ loading: true, error: null, memoires: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const memoires = await apiGet('/analyses/memoires-strategiques/')
      setState({ loading: false, error: null, memoires })
    } catch (err) {
      setState({ loading: false, error: err.message, memoires: [] })
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}