'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

function toCardShape(resultat) {
  const completude = Number(resultat.completude ?? 0)
  const confiance = resultat.confiance != null ? Math.round(Number(resultat.confiance) * 100) : null
  const status =
    resultat.statut_qualite === 'FIABLE' && completude >= 0.8 ? 'Prêt' : 'En revue'

  return {
    id: resultat.id,
    title: resultat.code_metrique?.replace(/_/g, ' '),
    type: resultat.unite || '—',
    date: resultat.periode_fin ? new Date(resultat.periode_fin).toLocaleDateString('fr-FR') : '—',
    dateRaw: resultat.periode_fin, // ← ajouté, pour le tri
    status,
    score: confiance ?? 0,
  }
}
export function useAnalysesData() {
  const [state, setState] = useState({ loading: true, error: null, analyses: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const resultats = await apiGet('/analyses/resultats-metriques/')
      setState({ loading: false, error: null, analyses: resultats.map(toCardShape) })
    } catch (err) {
      setState({ loading: false, error: err.message, analyses: [] })
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  return { ...state, reload }
}
