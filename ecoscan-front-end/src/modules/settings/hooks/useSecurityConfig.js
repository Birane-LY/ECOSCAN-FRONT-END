'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPatch } from '@/lib/apiClient'

export function useSecurityConfig() {
  const [state, setState] = useState({ loading: true, error: null, config: null })

  const reload = useCallback(async () => {
    try {
      const config = await apiGet('/organisations/configuration-securite/')
      setState({ loading: false, error: null, config })
    } catch (err) {
      setState({ loading: false, error: err.message, config: null })
    }
  }, [])

  const updateConfig = useCallback(async (patch) => {
    const config = await apiPatch('/organisations/configuration-securite/', patch)
    setState((s) => ({ ...s, config }))
    return config
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, updateConfig }
}