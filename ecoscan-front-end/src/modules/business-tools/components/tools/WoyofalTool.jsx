'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowUpRight, Check, Clock, FileText, Mic, Save } from 'lucide-react'
import { DotNumeral, GlassCard } from '@/components/instruments'
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
  // L'organisation doit être connue AVANT d'interroger le compteur
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

  // Une capture photo remplit le premier créneau vide
  useEffect(() => {
    if (!pendingCapture) return
    const valeur = pendingCapture.nouveau_index ?? pendingCapture.consommation_kwh
    if (valeur == null) {
      onCaptureConsumed?.()
      return
    }
    setSlotValues((current) => {
      const premierVide = SLOT_KEYS.find((id) => !current[id])
      if (!premierVide) return current
      return { ...current, [premierVide]: String(valeur) }
    })
    onCaptureConsumed?.()
  }, [pendingCapture, onCaptureConsumed])

  const savedTimeoutRef = useRef(null)
  useEffect(() => () => savedTimeoutRef.current && clearTimeout(savedTimeoutRef.current), [])

  const baseline = dernierReleve ? Number(dernierReleve.valeur) : 0
  const completedCount = Object.values(slotValues).filter(Boolean).length
  const dailyTotal = calculateDayCumulative(slotValues, baseline)
  const nextSlot = SLOT_KEYS.find((id) => !slotValues[id])

  const getPreviousValue = (slotIndex) => {
    for (let i = slotIndex - 1; i >= 0; i -= 1) {
      const key = SLOT_KEYS[i]
      if (slotValues[key]) return Number(slotValues[key])
    }
    return baseline
  }

  const handleSlotChange = (id, rawValue) => {
    setSlotValues((current) => ({ ...current, [id]: rawValue.replace(/\D/g, '') }))
    // Un créneau modifié après enregistrement repart en attente
    setSavedSlotIds((current) => {
      if (!current.has(id)) return current
      const next = new Set(current)
      next.delete(id)
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!compteur) {
      setSaveError('Aucun compteur trouvé pour votre organisation.')
      return
    }
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
      /* l'erreur est affichée via bilanError */
    }
  }

  if (organisationLoading || compteurLoading) return <p className="drawer-lead">Chargement de votre compteur…</p>
  if (organisationError || compteurError || !compteur) {
    return <p className="drawer-lead">Erreur : {organisationError || compteurError || 'Aucun compteur associé à votre organisation.'}</p>
  }

  return (
    <div className="wy">
      <aside className="wy-intro">
        <p className="wy-ref">Compteur {compteur.reference}</p>
        <h2>Votre journée énergétique, par séquences.</h2>
        <p>
          Relevez l’index toutes les quatre heures pour comprendre les rythmes de votre activité, puis terminez par un
          bilan personnel.
        </p>
        <p className="wy-reminders">
          <Clock size={16} /> Rappels à 08:00, 12:00, 16:00 et 20:00
        </p>

        <div className="wy-total">
          <span>Cumul de la journée</span>
          <div className="wy-total-num">
            <DotNumeral size={64}>{dailyTotal.toLocaleString('fr-FR')}</DotNumeral>
            <small>kWh</small>
          </div>
          <span className="wy-progress">{completedCount} créneau{completedCount > 1 ? 'x' : ''} sur 4 saisi{completedCount > 1 ? 's' : ''}</span>
        </div>
      </aside>

      <form className="wy-form" onSubmit={handleSubmit}>
        <div className="wy-slots">
          {WOYOFAL_SLOTS.map(([id, time, label], slotIndex) => {
            const value = slotValues[id]
            const delta = calculateSlotDelta(value, getPreviousValue(slotIndex))
            const state = value ? 'done' : id === nextSlot ? 'next' : 'todo'

            return (
              <GlassCard as="section" className={`wy-slot ${state}`} key={id}>
                <div className="wy-slot-head">
                  <span className="wy-orb" aria-hidden="true">
                    {state === 'done' ? <Check size={20} /> : time.slice(0, 2)}
                  </span>
                  <div>
                    <strong>{label}</strong>
                    <small>{time}{state === 'next' ? ', prochain relevé' : ''}</small>
                  </div>
                </div>

                <label className="fld">
                  Index du compteur
                  <input
                    inputMode="numeric"
                    value={value}
                    placeholder={slotIndex === 0 && dernierReleve ? String(baseline) : 'Saisir l’index'}
                    onChange={(e) => handleSlotChange(id, e.target.value)}
                  />
                </label>

                {value ? (
                  <p className="wy-delta">
                    +{delta.toLocaleString('fr-FR')} <small>kWh depuis le relevé précédent</small>
                  </p>
                ) : (
                  <p className="wy-delta muted">En attente de relevé</p>
                )}

                <input
                  className="wy-note"
                  value={slotNotes[id]}
                  placeholder="Note rapide (facultatif)"
                  aria-label={`Note pour ${label}`}
                  onChange={(e) => setSlotNotes((current) => ({ ...current, [id]: e.target.value }))}
                />
              </GlassCard>
            )
          })}
        </div>

        {saveError && <p className="form-error">{saveError}</p>}

        <div className="wy-save">
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : saved ? <><Check size={16} />Relevés enregistrés</> : <><Save size={16} />Enregistrer les relevés</>}
          </button>
          <span>Chaque créneau saisi est enregistré comme relevé en attente de validation.</span>
        </div>

        <GlassCard as="section" tone="inverse" className="wy-review">
          <div className="wy-review-head">
            <div>
              <strong>Comment s’est passée votre journée ?</strong>
              <small>Le bilan de fin de journée nourrit la mémoire d’EcoScan.</small>
            </div>
            <div className="wy-modes" role="group" aria-label="Mode de saisie">
              <button type="button" className={reviewMode === 'text' ? 'on' : ''} onClick={() => setReviewMode('text')}>
                <FileText size={15} />Écrit
              </button>
              <button type="button" className={reviewMode === 'voice' ? 'on' : ''} onClick={() => setReviewMode('voice')}>
                <Mic size={15} />Vocal
              </button>
            </div>
          </div>

          {reviewMode === 'text' ? (
            <textarea
              value={dayReview}
              onChange={(e) => setDayReview(e.target.value)}
              rows={4}
              placeholder="Ex. activité intense le matin, coupure à 16 h, journée stable ensuite…"
            />
          ) : (
            <>
              <button type="button" className={`wy-voice ${isRecording ? 'rec' : ''}`} onClick={() => setIsRecording((v) => !v)}>
                {isRecording ? <><span className="wy-rec-dot" />Enregistrement en cours, touchez pour terminer</> : <><Mic size={18} />Décrire ma journée à voix haute</>}
              </button>
              <p className="wy-demo">
                Mode démonstration : aucune transcription n’est enregistrée pour le moment. Passez en mode Écrit pour
                sauvegarder votre bilan.
              </p>
            </>
          )}

          {bilanError && <p className="form-error">{bilanError}</p>}

          <div className="wy-review-foot">
            <button type="button" className="secondary-button" onClick={handleFinishReview} disabled={savingBilan}>
              {savingBilan ? 'Enregistrement…' : bilanSaved ? 'Bilan enregistré' : 'Finaliser mon bilan'} <ArrowUpRight size={15} />
            </button>
            <button type="button" className="quiet-button wy-history" onClick={() => setDrawer('daily-history')}>
              Voir l’historique complet <ArrowUpRight size={14} />
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  )
}
