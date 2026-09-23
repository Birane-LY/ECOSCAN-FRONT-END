'use client'

import React, { useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import { statusTone } from './adminUi'
import { filterInvoices } from '../../services/adminServices'
import apiClient from '@/lib/apiClient'

export function InvoicesView({ invoices, setInvoices, notify, openModal }) {
  const [q, setQ] = useState('')
  const rows = filterInvoices(invoices, q)

  const handlePay = async (invoice) => {
    try {
      await apiClient.patch(`/billing/invoices/${invoice.id}/`, { status: 'Payée' })
      setInvoices(invoices.map((x) => (x.id === invoice.id ? { ...x, status: 'Payée' } : x)))
      notify(`Facture ${invoice.id} marquée comme payée`)
    } catch {
      notify('Erreur lors du règlement de la facture')
    }
  }

  // Calcul dynamique des statistiques
  const totalDue = invoices.filter((i) => i.status !== 'Payée').reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0)
  const totalPaid = invoices.filter((i) => i.status === 'Payée').reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0)
  const lateCount = invoices.filter((i) => i.status === 'En retard' || i.status === 'Impayée').length

  return (
    <>
      <AdminHeading
        title="Factures mensuelles"
        subtitle="Suivez les échéances, paiements et anomalies de recouvrement."
        action={
          <div className="adm-actions">
            <button className="secondary-button" onClick={() => openModal && openModal('invoice')}>
              <Plus size={16} />
              Nouvelle facture
            </button>
            <button className="primary-button" onClick={() => notify('Registre exporté')}>
              <Download size={16} />
              Exporter
            </button>
          </div>
        }
      />

      <div className="adm-stats compact">
        {[
          ['À encaisser', `${totalDue.toLocaleString()} FCFA`],
          ['Payées', `${totalPaid.toLocaleString()} FCFA`],
          ['En retard', `${lateCount}`],
          ['Total factures', `${invoices.length}`],
        ].map(([a, b]) => (
          <GlassCard as="article" className="adm-stat" key={a}>
            <span>{a}</span>
            <strong>{b}</strong>
          </GlassCard>
        ))}
      </div>

      <GlassCard as="article" className="adm-panel">
        <div className="adm-toolbar">
          <label className="fd-search">
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une facture…" aria-label="Rechercher une facture" />
          </label>
        </div>

        <div className="adm-table" style={{ '--cols': '1.2fr 1.4fr 1fr 1fr 1fr 1.4fr' }}>
          <div className="adm-row adm-head">
            <span>Facture</span>
            <span>Organisation</span>
            <span>Montant</span>
            <span>Échéance</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>
          {rows.map((i) => (
            <div className="adm-row" key={i.id}>
              <strong>{i.id}</strong>
              <span>{i.org || i.organization_name}</span>
              <span>{i.amount} FCFA</span>
              <span>{i.due || i.due_date}</span>
              <span className={`chip ${statusTone(i.status)}`}>{i.status}</span>
              <span className="adm-row-actions">
                <button type="button" className="secondary-button" onClick={() => (openModal ? openModal('invoice', i) : notify(`Détail de ${i.id}`))}>
                  Voir
                </button>
                {i.status !== 'Payée' && (
                  <button type="button" className="secondary-button" onClick={() => handlePay(i)}>
                    Payer
                  </button>
                )}
              </span>
            </div>
          ))}
          {rows.length === 0 && <p className="drawer-lead">Aucune facture ne correspond à cette recherche.</p>}
        </div>
      </GlassCard>
    </>
  )
}