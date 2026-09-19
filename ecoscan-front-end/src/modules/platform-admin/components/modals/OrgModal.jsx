'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

export function OrgModal({ initial, onSubmit, submitting, error }) {
  const [d, setD] = useState(
    initial
      ? { name: initial.name, sector: initial.sector, location: initial.location }
      : { name: '', sector: '', location: '' }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(d)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nom de l’organisation</label>
        <input
          required
          className="admin-input"
          placeholder="ex: Sunu Agro"
          value={d.name}
          onChange={(e) => setD({ ...d, name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Secteur d'activité</label>
        <input
          required
          className="admin-input"
          placeholder="ex: Agroalimentaire"
          value={d.sector}
          onChange={(e) => setD({ ...d, sector: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Localisation</label>
        <input
          required
          className="admin-input"
          placeholder="ex: Dakar, Sénégal"
          value={d.location}
          onChange={(e) => setD({ ...d, location: e.target.value })}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button className="admin-primary full-width" type="submit" disabled={submitting}>
          <Check size={14} />
          {submitting ? 'Enregistrement…' : 'Enregistrer l’organisation'}
        </button>
      </div>
    </form>
  )
}