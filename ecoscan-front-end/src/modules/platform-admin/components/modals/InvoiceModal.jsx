'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { statusTone } from '../views/adminUi'

export function InvoiceModal({ invoice, setInvoices, notify, close }) {
  if (!invoice) return null

  const markPaid = () => {
    setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? { ...i, status: 'Payée' } : i)))
    notify('Facture marquée comme payée')
    close()
  }

  return (
    <div className="adm-detail">
      <dl>
        <div>
          <dt>Numéro</dt>
          <dd>{invoice.id}</dd>
        </div>
        <div>
          <dt>Organisation</dt>
          <dd>{invoice.org}</dd>
        </div>
        <div>
          <dt>Montant</dt>
          <dd>{invoice.amount}</dd>
        </div>
        <div>
          <dt>Échéance</dt>
          <dd>{invoice.due}</dd>
        </div>
        <div>
          <dt>Moyen de règlement</dt>
          <dd>{invoice.method || 'Virement'}</dd>
        </div>
        <div>
          <dt>Statut actuel</dt>
          <dd>
            <span className={`chip ${statusTone(invoice.status)}`}>{invoice.status}</span>
          </dd>
        </div>
      </dl>
      <div className="adm-actions">
        {invoice.status !== 'Payée' && (
          <button className="primary-button" onClick={markPaid}>
            <Check size={15} /> Marquer comme payée
          </button>
        )}
        <button className="secondary-button" onClick={close}>
          Fermer
        </button>
      </div>
    </div>
  )
}
