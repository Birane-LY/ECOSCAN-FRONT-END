'use client'

import React from 'react'
import { Check } from 'lucide-react'

export function InvoiceModal({ invoice, setInvoices, notify, close }) {
  if (!invoice) return null

  const markPaid = () => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoice.id ? { ...i, status: 'Payée' } : i))
    )
    notify('Facture marquée comme payée')
    close()
  }

  return (
    <div className="invoice-modal-content">
      <div className="invoice-detail-grid">
        <div className="detail-item">
          <span>Numéro de facture</span>
          <strong>{invoice.id}</strong>
        </div>
        <div className="detail-item">
          <span>Organisation</span>
          <strong>{invoice.org}</strong>
        </div>
        <div className="detail-item">
          <span>Montant total</span>
          <strong className="text-teal">{invoice.amount}</strong>
        </div>
        <div className="detail-item">
          <span>Date d'échéance</span>
          <strong>{invoice.due}</strong>
        </div>
        <div className="detail-item">
          <span>Mode de règlement</span>
          <strong>{invoice.method || 'Virement bancaire'}</strong>
        </div>
        <div className="detail-item">
          <span>Statut actuel</span>
          <span className={`status-chip ${invoice.status === 'Payée' ? 'active' : 'warning'}`}>
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="modal-actions">
        {invoice.status !== 'Payée' && (
          <button className="admin-primary" onClick={markPaid}>
            <Check size={14} /> Marquer comme payée
          </button>
        )}
        <button className="admin-secondary" onClick={close}>
          Fermer
        </button>
      </div>
    </div>
  )
}