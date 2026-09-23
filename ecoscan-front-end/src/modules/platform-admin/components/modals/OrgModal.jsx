'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

// `initial` (en édition) est l'objet Organisation brut renvoyé par Django
// (nom, secteur, localisation...), pas un objet déjà "traduit" pour l'UI —
// il faut donc lire les mêmes clés que celles envoyées à l'API.
export function OrgModal({ initial, onSubmit }) {
  const [d, setD] = useState({
    nom: initial?.nom || '',
    secteur: initial?.secteur || '',
    localisation: initial?.localisation || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(d)
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {[
        ['nom', 'Nom de l’organisation', 'text'],
        ['secteur', 'Secteur', 'text'],
        ['localisation', 'Localisation', 'text'],
      ].map(([k, l, type]) => (
        <label key={k} className="fld span-2">
          {l}
          <input required type={type} value={d[k] || ''} onChange={(e) => setD({ ...d, [k]: e.target.value })} />
        </label>
      ))}
      <button className="primary-button span-2" type="submit">
        <Check size={16} />
        Enregistrer
      </button>
    </form>
  )
}