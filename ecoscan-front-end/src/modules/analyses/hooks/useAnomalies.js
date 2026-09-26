'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])
const idDe = (v) => (v && typeof v === 'object' ? v.id : v)

/**
 * Anomalies détectées, chacune enrichie de sa dernière diagnostics (`hypothese`,
 * ou null) : la page Analyses en fait le point de départ du flux
 * anomalie -> hypothèse -> recommandation.
 */
export function useAnomalies() {
  const [state, setState] = useState({ loading: true, error: null, anomalies: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const [anomalies, hypotheses] = await Promise.all([
        apiGet('/analyses/anomalies/').then(unwrap),
        apiGet('/analyses/hypotheses/').then(unwrap).catch(() => []),
      ])
      // Le backend trie les hypothèses de la plus récente à la plus ancienne
      const derniere = new Map()
      hypotheses.forEach((h) => {
        const id = idDe(h.anomalie)
        if (id && !derniere.has(id)) derniere.set(id, h)
      })
      setState({
        loading: false,
        error: null,
        anomalies: anomalies.map((a) => ({ ...a, hypothese: derniere.get(a.id) ?? null })),
      })
    } catch (err) {
      setState({ loading: false, error: err.message, anomalies: [] })
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}
