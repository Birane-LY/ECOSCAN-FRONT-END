'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useFicheProjet() {
  const [state, setState] = useState({ loading: true, error: null, ficheProjet: null })

  useEffect(() => {
    let cancelled = false
    apiGet('/organisations/projets/')
      .then((projets) => {
        if (!cancelled) setState({ loading: false, error: null, ficheProjet: projets[0] || null })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message, ficheProjet: null })
      })
    return () => { cancelled = true }
  }, [])

  return state
}