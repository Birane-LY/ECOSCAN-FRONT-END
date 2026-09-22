'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

export function PlanModal({ initial, onSubmit }) {
  const [d, setD] = useState(initial || { name: '', price: '', seats: '25', trial: '14 jours' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...d, active: initial?.active || 0, status: 'Actif' })
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {[
        ['name', 'Nom du plan'],
        ['price', 'Prix mensuel (FCFA)'],
        ['seats', 'Limite d’utilisateurs'],
        ['trial', 'Durée d’essai'],
      ].map(([k, l]) => (
        <label key={k} className="fld span-2">
          {l}
          <input required value={d[k] || ''} onChange={(e) => setD({ ...d, [k]: e.target.value })} />
        </label>
      ))}
      <label className="adm-check span-2">
        <input type="checkbox" defaultChecked /> Analytics avancés
      </label>
      <label className="adm-check span-2">
        <input type="checkbox" defaultChecked /> Support prioritaire
      </label>
      <button className="primary-button span-2" type="submit">
        <Check size={16} />
        Enregistrer le plan
      </button>
    </form>
  )
}
