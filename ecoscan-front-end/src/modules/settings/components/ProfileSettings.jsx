'use client'

import React, { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { apiGet, apiPatch } from '@/lib/apiClient'

export function ProfileSettings({ setSavedToast }) {
  const { user } = useAuth()
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.id) {
      apiGet(`/membres/${user.id}/`)
        .then((data) => {
          setNom(data.nom)
          setEmail(data.email)
        })
        .catch(() => {})
    }
  }, [user?.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiPatch(`/membres/${user.id}/`, { nom, email })
      setSavedToast?.('Profil mis à jour')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <GlassCard as="form" className="st-card" onSubmit={handleSubmit}>
      <header className="st-head">
        <h2>Informations personnelles</h2>
        <p>Votre identité et vos coordonnées professionnelles.</p>
      </header>
      {error && <p className="form-error">{error}</p>}
      <div className="st-fields">
        <label className="fld">
          Nom complet
          <input value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
        <label className="fld">
          Adresse email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div>
        <button className="primary-button" type="submit" disabled={saving}>
          <Save size={16} />
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </div>
    </GlassCard>
  )
}
