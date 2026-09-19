'use client'

import React from 'react'
import { Send } from 'lucide-react'

export function ReminderModal({ orgs, notify, close }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    notify('Relance programmée avec succès')
    close()
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Objet du message</label>
        <input
          required
          className="admin-input"
          defaultValue="Votre renouvellement EcoScan arrive à échéance"
        />
      </div>
      <div className="form-group">
        <label>Contenu de la notification</label>
        <textarea
          required
          rows={4}
          className="admin-textarea"
          defaultValue="Bonjour, votre abonnement EcoScan arrive bientôt à échéance. Veuillez vérifier vos informations de paiement."
        />
      </div>
      <div className="form-group">
        <label>Canal d'envoi</label>
        <select className="admin-select" defaultValue="Email">
          <option>Email</option>
          <option>Notification In-App</option>
        </select>
      </div>
      <div className="form-group">
        <label>Cible</label>
        <select className="admin-select">
          <option>Toutes les organisations à échéance</option>
          {orgs.map((o) => (
            <option key={o.id}>{o.name}</option>
          ))}
        </select>
      </div>

      <button className="admin-primary full-width" type="submit">
        <Send size={14} />
        Programmer la relance
      </button>
    </form>
  )
}