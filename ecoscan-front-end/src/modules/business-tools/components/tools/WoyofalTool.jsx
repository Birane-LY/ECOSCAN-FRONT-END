'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowUpRight, CheckCircle2, Clock, FileText, Mic, Save } from 'lucide-react'
import { useCompteur } from '@/modules/business-tools/hooks/useCompteur'
import { useWoyofalReadings } from '@/modules/business-tools/hooks/useWoyofalReadings'
import { useOrganisation } from '@/modules/business-tools/hooks/useOrganisation'
import { useDailyObservation } from '@/modules/business-tools/hooks/useDailyObservation'
import {
  WOYOFAL_SLOTS,
  calculateSlotDelta,
  calculateDayCumulative,
} from '@/modules/business-tools/services/woyofalCalculations'

const SLOT_KEYS = ['matin', 'midi', 'apresmidi', 'soir']

export function WoyofalTool({ setDrawer, pendingCapture, onCaptureConsumed }) {
  // L'organisation doit être connue AVANT d'interroger le compteur :
  // useCompteur() sans son id ne peut trouver aucun compteur.
  const { organisation, loading: organisationLoading, error: organisationError } = useOrganisation()
  const { compteur, loading: compteurLoading, error: compteurError } = useCompteur(organisation?.id)
  const { dernierReleve, enregistrerReleve } = useWoyofalReadings(compteur?.id)
  const { saving: savingBilan, error: bilanError, saved: bilanSaved, enregistrerBilan } = useDailyObservation(organisation?.id)

  const [slotValues, setSlotValues] = useState({ matin: '', midi: '', apresmidi: '', soir: '' })
  const [slotNotes, setSlotNotes] = useState({ matin: '', midi: '', apresmidi: '', soir: '' })

  const [savedSlotIds, setSavedSlotIds] = useState(() => new Set())
  const [dayReview, setDayReview] = useState('')
  const [reviewMode, setReviewMode] = useState('text')
  const [isRecording, setIsRecording] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Effet pour remplir automatiquement le premier créneau disponible lorsqu'une capture est reçue
  useEffect(() => {
    if (!pendingCapture) return

    const valeur = pendingCapture.nouveau_index ?? pendingCapture.consommation_kwh
    if (valeur == null) {
      onCaptureConsumed?.()
      return
    }

    setSlotValues((current) => {
      const premierVide = ['matin', 'midi', 'apresmidi', 'soir'].find((id) => !current[id])
      if (!premierVide) return current
      return { ...current, [premierVide]: String(valeur) }
    })

    onCaptureConsumed?.()
  }, [pendingCapture, onCaptureConsumed])

  const savedTimeoutRef = useRef(null)
  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  const baseline = dernierReleve ? Number(dernierReleve.valeur) : 0
  const completedCount = Object.values(slotValues).filter(Boolean).length
  const dailyTotal = calculateDayCumulative(slotValues, baseline)

  const getPreviousValue = (slotIndex) => {
    for (let i = slotIndex - 1; i >= 0; i -= 1) {
      const key = SLOT_KEYS[i]
      if (slotValues[key]) return Number(slotValues[key])
    }
    return baseline
  }

  const handleSlotChange = (id, rawValue) => {
    const cleaned = rawValue.replace(/\D/g, '')
    setSlotValues((current) => ({ ...current, [id]: cleaned }))
    // Si on modifie un créneau déjà sauvegardé, on le remet en attente
    // pour qu'il soit renvoyé au prochain enregistrement.
    setSavedSlotIds((current) => {
      if (!current.has(id)) return current
      const next = new Set(current)
      next.delete(id)
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!compteur) { setSaveError("Aucun compteur trouvé pour votre organisation."); return }
    const remplis = WOYOFAL_SLOTS.filter(([id]) => slotValues[id] && !savedSlotIds.has(id))
    if (remplis.length === 0) return

    setSaving(true)
    setSaveError(null)
    try {
      for (const [id, , label] of remplis) {
        await enregistrerReleve(Number(slotValues[id]), `${label} (${slotNotes[id] || 'sans note'})`)
        setSavedSlotIds((current) => new Set(current).add(id))
      }
      setSaved(true)
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
      savedTimeoutRef.current = window.setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleFinishReview = async () => {
    if (reviewMode !== 'text' || !dayReview.trim()) {
      setDrawer('daily-summary')
      return
    }
    try {
      await enregistrerBilan(dayReview)
      setDrawer('daily-summary')
    } catch {

    }
  }

  if (organisationLoading || compteurLoading) return <p className="drawer-lead">Chargement de votre compteur…</p>
  if (organisationError || compteurError || !compteur) {
    return <p className="drawer-lead">Erreur : {organisationError || compteurError || "Aucun compteur associé à votre organisation."}</p>
  }

  return (
    <section className="tool-panel daily-tool">
      <div className="tool-panel-copy">
        <p className="eyebrow">RITUEL WOYOFAL · COMPTEUR {compteur.reference}</p>
        <h2>Votre journée énergétique, par séquences.</h2>
        <p>Relevez l'index toutes les quatre heures pour comprendre les rythmes de votre activité, puis terminez par un bilan personnel.</p>
        <div className="sync-note">
          <Clock size={15} />
          <span>Prochains rappels <b>08:00 · 12:00 · 16:00 · 20:00</b></span>
        </div>
        <div className="slot-progress">
          <span><strong>{completedCount}/4</strong> créneaux complétés</span>
          <div><i style={{ width: `${completedCount * 25}%` }} /></div>
        </div>
      </div>

      <form className="daily-form multi-slot-form" onSubmit={handleSubmit}>
        <div className="slot-grid">
          {WOYOFAL_SLOTS.map(([id, time, label], slotIndex) => {
            const value = slotValues[id]
            const previousValue = getPreviousValue(slotIndex)
            const delta = calculateSlotDelta(value, previousValue)

            return (
              <div className={`reading-slot ${value ? 'completed' : ''}`} key={id}>
                <div className="slot-head">
                  <span className="slot-time">{time}</span>
                  <span className="slot-state">{value ? <><CheckCircle2 size={13} />Saisi</> : 'À saisir'}</span>
                </div>
                <strong>{label}</strong>
                <label>
                  Index compteur
                  <input
                    inputMode="numeric"
                    value={value}
                    placeholder={slotIndex === 0 && dernierReleve ? String(baseline) : 'Ajouter l\'index'}
                    onChange={(e) => handleSlotChange(id, e.target.value)}
                  />
                </label>
                {value && (
                  <div className="slot-consumption">
                    +{delta.toLocaleString('fr-FR')} <small>kWh depuis le relevé précédent</small>
                  </div>
                )}
                <input
                  className="slot-note"
                  value={slotNotes[id]}
                  placeholder="Note rapide (optionnel)"
                  onChange={(e) => setSlotNotes((current) => ({ ...current, [id]: e.target.value }))}
                />
              </div>
            )
          })}
        </div>

        <div className="daily-total">
          <div>
            <span>Cumul de la journée</span>
            <strong>{dailyTotal.toLocaleString('fr-FR')} <small>kWh</small></strong>
          </div>
          <span>Chaque créneau saisi est enregistré immédiatement comme relevé en attente de validation.</span>
        </div>

        {saveError && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{saveError}</p>}

        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Enregistrement…' : saved ? <><CheckCircle2 size={16} />Journée enregistrée</> : <><Save size={16} />Enregistrer les relevés</>}
        </button>

        <div className="day-review">
          <div className="review-heading">
            <div>
              <p className="eyebrow">BILAN DE FIN DE JOURNÉE</p>
              <strong>Comment s'est passée votre journée ?</strong>
            </div>
            <div className="review-modes">
              <button type="button" className={reviewMode === 'text' ? 'active' : ''} onClick={() => setReviewMode('text')}>
                <FileText size={14} />Écrit
              </button>
              <button type="button" className={reviewMode === 'voice' ? 'active' : ''} onClick={() => setReviewMode('voice')}>
                <Mic size={14} />Vocal
              </button>
            </div>
          </div>

          {reviewMode === 'text' ? (
            <textarea
              value={dayReview}
              onChange={(e) => setDayReview(e.target.value)}
              placeholder="Ex. activité intense le matin, coupure à 16h, journée stable ensuite..."
            />
          ) : (
            <>
              <button type="button" className={`voice-capture ${isRecording ? 'recording' : ''}`} onClick={() => setIsRecording((v) => !v)}>
                {isRecording ? <><span className="recording-dot" />Enregistrement en cours · appuyez pour terminer</> : <><Mic size={18} />Décrire ma journée à voix haute</>}
              </button>
              <p style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 6 }}>
                Mode démonstration — aucune transcription réelle n'est enregistrée pour le moment. Passez en mode Écrit pour que votre bilan soit sauvegardé.
              </p>
            </>
          )}

          {bilanError && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{bilanError}</p>}

          <button type="button" className="quiet-button" onClick={handleFinishReview} disabled={savingBilan}>
            {savingBilan ? 'Enregistrement…' : bilanSaved ? 'Bilan enregistré' : 'Finaliser mon bilan'} <ArrowUpRight size={14} />
          </button>
        </div>

        <button className="quiet-button" type="button" onClick={() => setDrawer('daily-history')}>
          Voir l'historique complet <ArrowUpRight size={14} />
        </button>
      </form>
    </section>
  )
}