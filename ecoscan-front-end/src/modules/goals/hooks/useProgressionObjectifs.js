'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])

/** Progression mesurée par objectif : { [objectif_id]: { mesuree, declaree, source, fiabilite, detail, raison } } */
export function useProgressionObjectifs() {
  const [state, setState] = useState({ loading: true, error: null, mesures: {} })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const liste = unwrap(await apiGet('/analyses/progression-objectifs/'))
      setState({ loading: false, error: null, mesures: Object.fromEntries(liste.map((m) => [m.objectif_id, m])) })
    } catch (err) {
      setState({ loading: false, error: err.message, mesures: {} })
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}
