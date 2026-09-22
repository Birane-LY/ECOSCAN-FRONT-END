'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

export function OrgModal({ initial, onSubmit }) {
  const [d, setD] = useState(initial || { name: '', sector: '', email: '', plan: 'Pro', due: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(d)
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {[
        ['name', 'Nom de l’organisation', 'text'],
        ['sector', 'Secteur', 'text'],
        ['email', 'Email administrateur', 'email'],
        ['due', 'Fin d’essai ou échéance', 'text'],
      ].map(([k, l, type]) => (
        <label key={k} className="fld span-2">
          {l}
          <input required type={type} value={d[k] || ''} onChange={(e) => setD({ ...d, [k]: e.target.value })} />
        </label>
      ))}
      <label className="fld span-2">
        Plan
        <select value={d.plan} onChange={(e) => setD({ ...d, plan: e.target.value })}>
          <option>Free</option>
          <option>Pro</option>
          <option>Enterprise</option>
        </select>
      </label>
      <button className="primary-button span-2" type="submit">
        <Check size={16} />
        Enregistrer
      </button>
    </form>
  )
}
