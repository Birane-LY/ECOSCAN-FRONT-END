'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

export function PlanModal({ initial, onSubmit }) {
  const [d, setD] = useState(
    initial || { name: '', price: '', seats: '25', trial: '14 jours' }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...d, active: initial?.active || 0, status: 'Actif' })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nom du plan</label>
        <input
          required
          className="admin-input"
          value={d.name}
          onChange={(e) => setD({ ...d, name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Prix mensuel (FCFA)</label>
        <input
          required
          className="admin-input"
          value={d.price}
          onChange={(e) => setD({ ...d, price: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Limite d'utilisateurs</label>
        <input
          required
          className="admin-input"
          value={d.seats}
          onChange={(e) => setD({ ...d, seats: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Durée d’essai gratuit</label>
        <input
          required
          className="admin-input"
          value={d.trial}
          onChange={(e) => setD({ ...d, trial: e.target.value })}
        />
      </div>

      <div className="form-checkboxes">
        <label className="check-label">
          <input type="checkbox" defaultChecked />
          <span>Analytics avancés</span>
        </label>
        <label className="check-label">
          <input type="checkbox" defaultChecked />
          <span>Support prioritaire 24/7</span>
        </label>
      </div>

      <button className="admin-primary full-width" type="submit">
        <Check size={14} />
        Enregistrer le plan
      </button>
    </form>
  )
}