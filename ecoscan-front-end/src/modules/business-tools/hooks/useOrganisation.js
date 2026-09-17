'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useOrganisation() {
  const [state, setState] = useState({ loading: true, error: null, organisation: null })

  useEffect(() => {
    let cancelled = false
    apiGet('/organisations/structures/')
      .then((orgs) => {
        if (!cancelled) setState({ loading: false, error: null, organisation: orgs[0] || null })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message, organisation: null })
      })
    return () => { cancelled = true }
  }, [])

  return state
}