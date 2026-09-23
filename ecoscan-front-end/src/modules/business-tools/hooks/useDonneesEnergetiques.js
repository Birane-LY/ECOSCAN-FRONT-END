'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useDonneesEnergetiques(
  compteurId,
  { limit = 10 } = {}
) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    donnees: [],
  })

  const reload = useCallback(async () => {
    if (!compteurId) {
      setState({
        loading: false,
        error: null,
        donnees: [],
      })
      return
    }

    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }))

    try {
      const donnees = await apiGet(
        `/energies/donnees-energetiques/?compteur=${encodeURIComponent(compteurId)}`
      )

      if (!Array.isArray(donnees)) {
        setState({
          loading: false,
          error: 'Réponse inattendue du serveur pour les relevés.',
          donnees: [],
        })
        return
      }

      const trie = [...donnees].sort(
        (a, b) =>
          new Date(b.periode_fin) - new Date(a.periode_fin)
      )

      setState({
        loading: false,
        error: null,
        donnees: trie.slice(0, limit),
      })
    } catch (err) {
      setState({
        loading: false,
        error: err.message,
        donnees: [],
      })
    }
  }, [compteurId, limit])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    ...state,
    reload,
  }
}