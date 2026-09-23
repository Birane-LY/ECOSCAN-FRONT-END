'use client'

import React, { useState } from 'react'
import { Check, Send } from 'lucide-react'
import { statusTone } from '../views/adminUi'
import apiClient from '@/lib/apiClient'

// Formulaire de création d'une facture. Rendu par PlatformAdminView quand
// `invoice` est vide (bouton "Nouvelle facture" de InvoicesView).
function InvoiceCreateForm({ orgs, setInvoices, notify, close }) {
  const [d, setD] = useState({
    organisation: orgs?.[0]?.id || '',
    amount: '',
    due: '',
    method: 'Virement',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!d.organisation || !d.amount || !d.due) return
    setSubmitting(true)
    try {
      const res = await apiClient.post('/billing/invoices/', {
        organisation: d.organisation,
        amount: d.amount,
        due: d.due,
        method: d.method,
        status: 'À encaisser',
      })
      setInvoices((prev) => [res.data, ...prev])
      notify('Facture créée')
      close()
    } catch (err) {
      notify(err.message || 'Erreur lors de la création de la facture')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="fld span-2">
        Organisation
        <select
          required
          value={d.organisation}
          onChange={(e) => setD({ ...d, organisation: e.target.value })}
        >
          {(orgs || []).map((o) => (
            <option key={o.id} value={o.id}>
              {o.name || o.nom}
            </option>
          ))}
        </select>
      </label>
      <label className="fld">
        Montant (FCFA)
        <input
          required
          type="number"
          min="0"
          value={d.amount}
          onChange={(e) => setD({ ...d, amount: e.target.value })}
        />
      </label>
      <label className="fld">
        Échéance
        <input
          required
          type="date"
          value={d.due}
          onChange={(e) => setD({ ...d, due: e.target.value })}
        />
      </label>
      <label className="fld span-2">
        Moyen de règlement
        <select value={d.method} onChange={(e) => setD({ ...d, method: e.target.value })}>
          <option>Virement</option>
          <option>Mobile Money</option>
          <option>Carte bancaire</option>
          <option>Chèque</option>
        </select>
      </label>
      <button className="primary-button span-2" type="submit" disabled={submitting}>
        <Send size={15} />
        {submitting ? 'Création…' : 'Créer la facture'}
      </button>
    </form>
  )
}

// Détail d'une facture existante : lecture + passage au statut "Payée".
function InvoiceDetail({ invoice, setInvoices, notify, close }) {
  const [submitting, setSubmitting] = useState(false)

  const markPaid = async () => {
    setSubmitting(true)
    try {
      await apiClient.patch(`/billing/invoices/${invoice.id}/`, { status: 'Payée' })
      setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? { ...i, status: 'Payée' } : i)))
      notify('Facture marquée comme payée')
      close()
    } catch (err) {
      notify(err.message || 'Erreur lors de la mise à jour de la facture')
    } finally {
      setSubmitting(false)
    }
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
          <button className="primary-button" onClick={markPaid} disabled={submitting}>
            <Check size={15} /> {submitting ? 'Mise à jour…' : 'Marquer comme payée'}
          </button>
        )}
        <button className="secondary-button" onClick={close}>
          Fermer
        </button>
      </div>
    </div>
  )
}

export function InvoiceModal({ invoice, orgs, setInvoices, notify, close }) {
  if (!invoice) {
    return <InvoiceCreateForm orgs={orgs} setInvoices={setInvoices} notify={notify} close={close} />
  }
  return <InvoiceDetail invoice={invoice} setInvoices={setInvoices} notify={notify} close={close} />
}