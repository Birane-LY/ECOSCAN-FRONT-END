'use client'

import React, { useState, useEffect } from 'react'
import { Save, User } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { apiGet } from '@/lib/apiClient'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function apiPatch(path, body) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || JSON.stringify(err) || `Erreur ${res.status}`)
  }
  return res.json()
}

export function ProfileSettings({ setSavedToast }) {
  const { user } = useAuth()
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.id) {
      apiGet(`/membres/${user.id}/`).then((data) => {
        setNom(data.nom)
        setEmail(data.email)
      }).catch(() => {})
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
    <form className="settings-section" onSubmit={handleSubmit}>
      <div className="section-head">
        <User size={18} />
        <div>
          <h3>Informations personnelles</h3>
          <p>Gérez votre identité et vos coordonnées d'entreprise.</p>
        </div>
      </div>
      {error && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{error}</p>}
      <div className="settings-grid">
        <label>
          Nom complet
          <input value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
        <label>
          Adresse email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <button className="primary-button" type="submit" disabled={saving}>
        <Save size={15} />{saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
      </button>
    </form>
  )
}