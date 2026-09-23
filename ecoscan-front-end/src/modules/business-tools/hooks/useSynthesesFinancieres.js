'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

/**
 * Synthèses financières déjà enregistrées pour une fiche projet — utilisées
 * comme scénarios réels dans RoiTool, 
 */
export function useSynthesesFinancieres(ficheProjetId) {
  const [state, setState] = useState({ loading: true, error: null, syntheses: [] })

  const reload = useCallback(async () => {
    if (!ficheProjetId) {
      setState({ loading: false, error: null, syntheses: [] })
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const response = await apiGet(`/energies/syntheses-financieres/?fiche_projet=${ficheProjetId}`)
      const syntheses = Array.isArray(response) ? response : response?.results
      if (!Array.isArray(syntheses)) {
        setState({ loading: false, error: 'Réponse inattendue du serveur pour les synthèses financières.', syntheses: [] })
        return
      }
      const trie = [...syntheses].sort(
        (a, b) => new Date(b.date_creation || 0) - new Date(a.date_creation || 0)
      )
      setState({ loading: false, error: null, syntheses: trie })
    } catch (err) {
      setState({ loading: false, error: err.message, syntheses: [] })
    }
  }, [ficheProjetId])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}