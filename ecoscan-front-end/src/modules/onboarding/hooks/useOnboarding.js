'use client'
import { useState, useCallback } from 'react'
import { apiPost } from '@/lib/apiClient'

export function useOnboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [organisation, setOrganisation] = useState(null)
  const [site, setSite] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const creerOrganisation = useCallback(async ({ nom, secteur, localisation }) => {
    setSaving(true); setError(null)
    try {
      const org = await apiPost('/organisations/structures/', { nom, secteur, localisation })
      setOrganisation(org)
      setStep(2)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const creerSite = useCallback(async ({ nom, adresse, pays, fuseau_horaire }) => {
    if (!organisation) return
    setSaving(true); setError(null)
    try {
      const nouveauSite = await apiPost('/organisations/sites/', {
        organisation: organisation.id, nom, adresse, pays, fuseau_horaire,
      })
      setSite(nouveauSite)
      setStep(3)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [organisation])

  const creerCompteur = useCallback(async ({ reference, type_energie, unite, statut_synchronisation }) => {
    if (!site) return
    setSaving(true); setError(null)
    try {
      await apiPost('/organisations/compteurs/', {
        site: site.id, reference, type_energie, unite, statut_synchronisation,
      })
      setStep(4)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [site])

  const creerFicheProjet = useCallback(async ({ nom, description }) => {
    if (!organisation) return
    setSaving(true); setError(null)
    try {
      await apiPost('/organisations/projets/', { organisation: organisation.id, nom, description })
      onComplete?.()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [organisation, onComplete])

  const passerEtape = useCallback(() => {
    if (step >= 4) onComplete?.()
    else setStep((s) => s + 1)
  }, [step, onComplete])

  return { step, saving, error, creerOrganisation, creerSite, creerCompteur, creerFicheProjet, passerEtape }
}