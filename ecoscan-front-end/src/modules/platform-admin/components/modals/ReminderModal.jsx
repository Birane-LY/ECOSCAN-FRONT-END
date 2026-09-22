'use client'

import React from 'react'
import { Send } from 'lucide-react'

export function ReminderModal({ orgs, notify, close }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    notify('Relance programmée')
    close()
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="fld span-2">
        Objet
        <input required defaultValue="Votre renouvellement EcoScan arrive à échéance" />
      </label>
      <label className="fld span-2">
        Message
        <textarea required rows={4} defaultValue="Bonjour, votre abonnement EcoScan arrive bientôt à échéance." />
      </label>
      <label className="fld">
        Canal
        <select defaultValue="Email">
          <option>Email</option>
          <option>In-app</option>
        </select>
      </label>
      <label className="fld">
        Organisations
        <select>
          <option>Toutes les organisations à échéance</option>
          {orgs.map((o) => (
            <option key={o.id}>{o.name}</option>
          ))}
        </select>
      </label>
      <button className="primary-button span-2" type="submit">
        <Send size={15} />
        Programmer la relance
      </button>
    </form>
  )
}
