'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

const SOURCE_NOM = 'Saisie manuelle Woyofal'

async function resoudreSourceManuelle() {
  const sources = await apiGet('/energies/sources-donnees/')
  const existante = sources.find((s) => s.nom === SOURCE_NOM)
  if (existante) return existante
  return apiPost('/energies/sources-donnees/', {
    nom: SOURCE_NOM,
    type: 'MANUELLE',
    origine: 'Saisie utilisateur',
    frequence: 'Variable',
    statut_synchronisation: 'MANUEL',
  })
}

export function useWoyofalReadings(compteurId) {
  const [state, setState] = useState({ loading: true, error: null, dernierReleve: null })

  const reload = useCallback(async () => {
    if (!compteurId) { setState({ loading: false, error: null, dernierReleve: null }); return }
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const releves = await apiGet(`/energies/donnees-energetiques/?compteur=${compteurId}`)
      const trie = [...releves].sort((a, b) => new Date(b.periode_fin) - new Date(a.periode_fin))
      setState({ loading: false, error: null, dernierReleve: trie[0] || null })
    } catch (err) {
      setState({ loading: false, error: err.message, dernierReleve: null })
    }
  }, [compteurId])

  const enregistrerReleve = useCallback(async (valeur, noteCreneau) => {
    if (!compteurId) throw new Error("Aucun compteur disponible pour votre organisation.")
    const source = await resoudreSourceManuelle()
    const maintenant = new Date().toISOString()
    const releve = await apiPost('/energies/donnees-energetiques/', {
      compteur: compteurId,
      source_donnee: source.id,
      valeur,
      unite: 'kWh',
      periode_debut: maintenant,
      periode_fin: maintenant,
      statut_validation: 'EN_ATTENTE',
      source: noteCreneau || 'Relevé Woyofal',
    })
    await reload()
    return releve
  }, [compteurId, reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, enregistrerReleve }
}