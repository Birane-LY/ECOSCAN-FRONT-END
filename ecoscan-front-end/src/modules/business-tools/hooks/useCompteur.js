'use client'
import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useCompteur() {
  const [state, setState] = useState({ loading: true, error: null, compteur: null })

  useEffect(() => {
    let cancelled = false
    apiGet('/organisations/compteurs/')
      .then((response) => {
        if (cancelled) return
        // Certains endpoints DRF renvoient un tableau brut, d'autres une
        // réponse paginée { results: [...] }. On gère les deux pour éviter
        // un `compteur: null` silencieux quand la forme change.
        const compteurs = Array.isArray(response) ? response : response?.results
        if (!Array.isArray(compteurs)) {
          setState({
            loading: false,
            error: "Réponse inattendue du serveur pour les compteurs.",
            compteur: null,
          })
          return
        }
        setState({ loading: false, error: null, compteur: compteurs[0] || null })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message, compteur: null })
      })
    return () => { cancelled = true }
  }, [])

  return state
}