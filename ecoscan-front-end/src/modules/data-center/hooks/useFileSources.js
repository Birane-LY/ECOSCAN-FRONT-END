'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

const STATUS_LABELS = {
  TERMINE: 'Prêt', REVUE_REQUISE: 'À vérifier', INCOHERENT: 'À vérifier',
  HORS_PERIMETRE: 'Rejeté', ECHOUE: 'Rejeté', EN_COURS: 'En cours',
  EN_ATTENTE: 'En attente', ANNULE: 'Annulé',
}

function toFileShape(importItem) {
  return {
    id: importItem.id,
    name: importItem.nom_fichier,
    kind: importItem.format,
    rows: importItem.nombre_lignes,
    status: STATUS_LABELS[importItem.statut] || importItem.statut,
    time: importItem.date_import ? new Date(importItem.date_import).toLocaleDateString('fr-FR') : '—',
  }
}

export function useFileSources() {
  const [state, setState] = useState({ loading: true, error: null, files: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const imports = await apiGet('/energy/imports/')
      setState({ loading: false, error: null, files: imports.map(toFileShape) })
    } catch (err) {
      setState({ loading: false, error: err.message, files: [] })
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}