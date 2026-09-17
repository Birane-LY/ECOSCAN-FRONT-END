'use client'
import React, { useState } from 'react'

export function GoalHero({ objectif, onUpdateTarget }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(objectif?.valeur_cible ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  if (!objectif) {
    return (
      <section className="goal-hero">
        <div><h2>Aucun objectif actif.</h2><p>Créez un objectif pour suivre votre trajectoire.</p></div>
      </section>
    )
  }

  const pct = Math.min(100, Math.round((objectif.progression_actuelle / objectif.valeur_cible) * 100))

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
    <section className="goal-hero">
      <div className="goal-score">
        <div className="goal-ring" style={{ borderColor: `${pct >= 100 ? 'var(--green)' : 'var(--copper)'}` }}>
          <strong>{pct}%</strong>
          <span>atteint</span>
        </div>
        <div>
          <h2>{objectif.nom}</h2>
          <p>{objectif.progression_actuelle} / {objectif.valeur_cible} {objectif.unite}</p>
        </div>
      </div>

      <div className="forecast">
        <span>CIBLE ACTUELLE</span>
        {editing ? (
          <>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ width: 100, padding: 8, border: '1px solid var(--border)', borderRadius: 8 }}
            />
            {error && <small style={{ color: 'var(--copper)' }}>{error}</small>}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="primary-button" onClick={handleSave} disabled={saving}>{saving ? '…' : 'Valider'}</button>
              <button className="secondary-button" onClick={() => setEditing(false)}>Annuler</button>
            </div>
          </>
        ) : (
          <>
            <strong>{objectif.valeur_cible} {objectif.unite}</strong>
            <button className="quiet-button" onClick={() => setEditing(true)}>Mettre à jour la cible</button>
          </>
        )}
      </div>
    </section>
  )
}