'use client'
import { useState, useCallback } from 'react'
import { apiPost } from '@/lib/apiClient'

export function useDailyObservation(organisationId) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  const enregistrerBilan = useCallback(async (texte, creneau = 'FIN_JOURNEE') => {
    if (!organisationId) throw new Error("Aucune organisation associée.")
    if (!texte.trim()) throw new Error("Le bilan est vide.")
    setSaving(true)
    setError(null)
    try {
      const observation = await apiPost('/analyses/observations/', {
        organisation: organisationId,
        texte: texte.trim(),
        date_observation: new Date().toISOString(),
        creneau,
      })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
      return observation
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [organisationId])

  return { saving, error, saved, enregistrerBilan }
}