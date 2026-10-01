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

  const genererRapport = useCallback(async ({
    organisationId,
    ficheProjetId,
    memoireId,
    type,
    template,
    periodLabel,
  }) => {
    const typeLivrable = type || TEMPLATE_TO_TYPE[template] || template
    const created = await apiPost('/analyses/livrables/', {
      organisation: organisationId,
      fiche_projet: ficheProjetId || null,
      memoire: memoireId || null,
      nom: `EcoScan_${typeLivrable === 'MEMOIRE' ? 'Memoire' : 'Rapport'}_${periodLabel}`.slice(0, 180),
      type: typeLivrable,
    })
    const generated = await apiPost(`/analyses/livrables/${created.id}/generer/`)
    await reload()
    return generated
  }, [reload])

  useEffect(() => {
    const timer = window.setTimeout(() => { void reload() }, 0)
    return () => window.clearTimeout(timer)
  }, [reload])
  return { ...state, reload, genererRapport }
}