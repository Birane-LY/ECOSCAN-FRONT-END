'use client'


import { useState, useRef, useCallback } from 'react'
import { apiGet, apiPost } from '@/lib/apiClient'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function apiPostFormData(path, formData) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    // Pas de Content-Type : le navigateur pose lui-même le boundary multipart.
    headers: { ...authHeaders() },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || err.fichier?.[0] || JSON.stringify(err) || `Erreur ${res.status}`)
  }
  return res.json()
}

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])

export function useDataSources() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadStage, setUploadStage] = useState(0) // 0 repos · 1-2 en cours · 3 terminé
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  const openUpload = () => { setUploadOpen(true); setUploadStage(0); setResult(null) }
  const closeUpload = () => { setUploadOpen(false); setUploadStage(0); setResult(null) }

  const handleCreateSource = useCallback(async (formData = {}) => {
    // Le serializer SourceDonnee exige ces 5 champs (les anciens « type_source » et
    // « description » n'existent pas) : sans eux, la création répondait 400.
    return apiPost('/energies/sources-donnees/', {
      nom: formData.nom || 'Compteur Principal',
      type: formData.type || 'COMPTEUR', // "COMPTEUR", "MANUEL", "WOYOFAL"...
      origine: formData.origine || 'Saisie manuelle',
      frequence: formData.frequence || 'Ponctuelle',
      statut_synchronisation: formData.statut_synchronisation || 'Non synchronisé',
    })
  }, [])

  const processUpload = useCallback(async (fileOrEvent) => {
    const input = fileOrEvent?.target?.files ? fileOrEvent.target : null
    const file = input ? input.files[0] : fileOrEvent
    if (!file) return

    setUploadStage(1)
    try {
      // Étape 1 — dépôt physique du fichier
      const formData = new FormData()
      formData.append('fichier', file)
      const fichierSource = await apiPostFormData('/energies/fichiers-sources/', formData)

      setUploadStage(2)

      // Compteur par défaut, optionnel : son absence ne doit jamais bloquer l'import
      let compteurId = null
      try {
        compteurId = unwrap(await apiGet('/organisations/compteurs/'))[0]?.id ?? null
      } catch {}

      // Étape 2 — création de l'import rattaché au fichier
      const importCree = await apiPost('/energies/imports/', {
        fichier_source: fichierSource.id,
        ...(compteurId ? { compteur: compteurId } : {}),
      })

      // Étape 3 — pipeline OCR -> classification -> extraction -> validation.
      // Côté serveur, « lancer » publie déjà le résultat métrique (et lance
      // l'analyse d'anomalie) quand le statut est TERMINE.
      const importTraite = await apiPost(`/energies/imports/${importCree.id}/lancer/`)

      if (importTraite.statut === 'TERMINE' || importTraite.statut === 'REVUE_REQUISE') {
        try { await apiPost('/analyses/integration/energy/', { import_id: importTraite.id }) } catch {}
      }

      setResult(importTraite)
      setUploadStage(3)
    } catch (err) {
      setResult({ statut: 'ECHOUE', ocr_erreur: err.message })
      setUploadStage(3)
    } finally {
      if (input) input.value = '' // permet de re-sélectionner le même fichier
    }
  }, [])

  const finishUpload = useCallback(async (callback) => {
    if (result && result.id) {
      try {
        await apiPost(`/energies/imports/${result.id}/valider-et-publier/`).catch(() =>
          apiPost('/analyses/integration/energy/', { import_id: result.id })
        )
      } catch (e) {
        console.warn('Publication de l analyse :', e)
      }
    }
    closeUpload()
    if (callback) callback()
  }, [result, closeUpload])

  return {
    uploadOpen, uploadStage, result, fileRef,
    openUpload, closeUpload, processUpload, finishUpload, handleCreateSource,
  }
}
