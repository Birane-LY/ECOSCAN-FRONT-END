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
    // Pas de Content-Type fixé ici : le navigateur doit poser lui-même le
    // boundary multipart/form-data — le fixer manuellement casse l'upload.
    headers: { ...authHeaders() },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || JSON.stringify(err) || `Erreur ${res.status}`)
  }
  return res.json()
}

export function useDataSources() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadStage, setUploadStage] = useState(0) // 0 idle · 1-2 en cours · 3 terminé
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  const openUpload = () => { setUploadOpen(true); setUploadStage(0); setResult(null) }
  const closeUpload = () => { setUploadOpen(false); setUploadStage(0); setResult(null) }

  // Création manuelle d'une source de données via l'API
  const handleCreateSource = useCallback(async (formData = {}) => {
    try {
      const response = await apiPost('/energies/sources-donnees/', {
        nom: formData.nom || "Compteur Principal",
        type_source: formData.type_source || "COMPTEUR", // "COMPTEUR", "MANUEL", "WOYOFAL", etc.
        description: formData.description || "",
      })

      console.log("Source de données créée :", response)
      return response
    } catch (error) {
      console.error("Erreur lors de la création de la source :", error)
      throw error
    }
  }, [])

  const processUpload = useCallback(async (fileOrEvent) => {
    const file = fileOrEvent?.target?.files ? fileOrEvent.target.files[0] : fileOrEvent
    if (!file) return

    setUploadStage(1)
    try {
      // Gate 1 — dépôt physique du fichier
      const formData = new FormData()
      formData.append('fichier', file)
      const fichierSource = await apiPostFormData('/energies/fichiers-sources/', formData)

      setUploadStage(2)

      // Récupération éventuelle du premier compteur disponible
      let compteurId = null
      try {
        const compteurs = await apiGet('/organisations/compteurs/')
        compteurId = compteurs[0]?.id ?? null
      } catch {
        // L'absence de compteur configuré ne doit jamais bloquer l'import — reste optionnel
      }

      // Création de l'enregistrement d'import rattaché au fichier déposé
      const importCree = await apiPost('/energies/imports/', {
        fichier_source: fichierSource.id,
        ...(compteurId ? { compteur: compteurId } : {}),
      })

      // Gate 2 — pipeline OCR → classification → extraction → validation
      const importTraite = await apiPost(`/energies/imports/${importCree.id}/lancer/`)

      if (importTraite.statut === 'TERMINE') {
        await apiPost('/analyses/integration/energy/', { import_id: importTraite.id })
      }

      setResult(importTraite)
      setUploadStage(3)
    } catch (err) {
      setResult({ statut: 'ECHOUE', ocr_erreur: err.message })
      setUploadStage(3)
    }
  }, [])

  const finishUpload = useCallback((callback) => {
    closeUpload()
    if (callback) callback()
  }, [])

  return {
    uploadOpen, 
    uploadStage, 
    result, 
    fileRef,
    openUpload, 
    closeUpload, 
    processUpload, 
    finishUpload,
    handleCreateSource, 
  }
}