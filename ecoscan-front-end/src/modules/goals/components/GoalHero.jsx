'use client'
import React, { useEffect, useState } from 'react'
import { ArcGauge, GlassCard, TickProgress } from '@/components/instruments'

const pctOf = (o) => (o?.valeur_cible ? Math.min(100, Math.round((o.progression_actuelle / o.valeur_cible) * 100)) : 0)

export function GoalHero({ objectif, onUpdateTarget }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(objectif?.valeur_cible ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // L'objectif arrive après le premier rendu : on resynchronise le champ
  useEffect(() => {
    setValue(objectif?.valeur_cible ?? '')
  }, [objectif?.id, objectif?.valeur_cible])

  if (!objectif) {
    return (
      <GlassCard className="gl-hero gl-hero-empty">
        <h2>Aucun objectif actif.</h2>
        <p>Créez un objectif pour suivre votre trajectoire.</p>
      </GlassCard>
    )
  }

  const pct = pctOf(objectif)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await onUpdateTarget(objectif.id, Number(value))
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <GlassCard as="section" className="gl-hero">
      <div className="gl-hero-gauge">
        <ArcGauge value={pct} unit=" %" label="atteint" size={260} animate />
      </div>

      <div className="gl-hero-copy">
        <h2>{objectif.nom}</h2>
        <p>
          {objectif.progression_actuelle} sur {objectif.valeur_cible} {objectif.unite}
        </p>
        <TickProgress value={pct} ticks={34} label="Progression vers la cible" />
      </div>

      <div className="gl-hero-target">
        <span className="k">Cible actuelle</span>
        {editing ? (
          <>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Nouvelle valeur cible"
            />
            {error && <small className="gl-error">{error}</small>}
            <div className="gl-hero-actions">
              <button className="primary-button" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Valider'}
              </button>
              <button className="secondary-button" onClick={() => setEditing(false)}>
                Annuler
              </button>
            </div>
          </>
        ) : (
          <>
            <strong>
              {objectif.valeur_cible} <small>{objectif.unite}</small>
            </strong>
            <button className="quiet-button" onClick={() => setEditing(true)}>
              Mettre à jour la cible
            </button>
          </>
        )}
      </div>
    </GlassCard>
  )
}
