'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

const TEMPLATE_TO_TYPE = { accountant: 'COMPTABLE', bank: 'BANQUE', investor: 'INVESTISSEUR' }

export function useLivrables() {
  const [state, setState] = useState({ loading: true, error: null, livrables: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const livrables = await apiGet('/analyses/livrables/')
      setState({ loading: false, error: null, livrables })
    } catch (err) {
      setState({ loading: false, error: err.message, livrables: [] })
    }
  }, [])

  const genererRapport = useCallback(async ({ ficheProjetId, template, periodLabel }) => {
    const created = await apiPost('/analyses/livrables/', {
      fiche_projet: ficheProjetId,
      nom: `EcoScan_Rapport_${periodLabel}`,
      type: TEMPLATE_TO_TYPE[template] || template,
    })
    await apiPost(`/analyses/livrables/${created.id}/generer/`)
    await reload()
    return created
  }, [reload])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload, genererRapport }
}