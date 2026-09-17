'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

export function useTeamMembers() {
  const [state, setState] = useState({ loading: true, error: null, membres: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const membres = await apiGet('/membres/')
      setState({ loading: false, error: null, membres })
    } catch (err) {
      setState({ loading: false, error: err.message, membres: [] })
    }
  }, [])

  const inviter = useCallback(async ({ nom, email, role }) => {
    await apiPost('/membres/', { nom, email, role })
    await reload()
  }, [reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, inviter }
}