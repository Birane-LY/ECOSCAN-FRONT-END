'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiPost, apiPatch } from '@/lib/apiClient'

const STATUS_LABELS = {
  EN_ATTENTE: 'À valider',
  ACTIVE: 'Actif',
  SUSPENDUE: 'Suspendu',
  ARCHIVEE: 'Archivée',
}

function toRowShape(org) {
  return {
    id: org.id,
    name: org.nom,
    sector: org.secteur,
    location: org.localisation,
    status: STATUS_LABELS[org.statut] || org.statut,
    statusRaw: org.statut,
    defautPaiement: org.defaut_paiement,
    users: org.nombre_membres ?? 0,
    createdAt: org.date_creation,
  }
}

export function useOrganisations() {
  const [state, setState] = useState({ loading: true, error: null, organisations: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const data = await apiGet('/organisations/structures/')
      setState({ loading: false, error: null, organisations: data.map(toRowShape) })
    } catch (err) {
      setState({ loading: false, error: err.message, organisations: [] })
    }
  }, [])

  const creer = useCallback(async ({ name, sector, location }) => {
    await apiPost('/organisations/structures/', {
      nom: name,
      secteur: sector,
      localisation: location,
    })
    await reload()
  }, [reload])

  const modifierInfos = useCallback(async (id, { name, sector, location }) => {
    await apiPatch(`/organisations/structures/${id}/`, {
      nom: name,
      secteur: sector,
      localisation: location,
    })
    await reload()
  }, [reload])

  const activer = useCallback(async (id) => {
    await apiPatch(`/organisations/structures/${id}/`, { statut: 'ACTIVE' })
    await reload()
  }, [reload])

  const suspendre = useCallback(async (id) => {
    await apiPatch(`/organisations/structures/${id}/`, { statut: 'SUSPENDUE' })
    await reload()
  }, [reload])

  useEffect(() => { reload() }, [reload])

  return { ...state, reload, creer, modifierInfos, activer, suspendre }
}