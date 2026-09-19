'use client'

import React, { useState } from 'react'
import { Download, Search, FileText } from 'lucide-react'
import { AdminHeading } from './AdminHeading'
import { filterInvoices } from '../../services/adminServices'

export function InvoicesView({ invoices, setInvoices, notify, openModal }) {
  const [q, setQ] = useState('')
  const rows = filterInvoices(invoices, q)

  return (
    <>
      <AdminHeading
        eyebrow="FINANCE CONTROL"
        title="Factures mensuelles"
        subtitle="Suivez les échéances, paiements et anomalies de recouvrement."
        action={
          <button
            className="admin-primary"
            onClick={() => notify('Registre exporté')}
          >
            <Download size={14} />
            Exporter
          </button>
        }
      />

      <div className="admin-stat-grid compact">
        {[
          ['À encaisser', '1.84M FCFA'],
          ['Payées', '12.36M FCFA'],
          ['En retard', '3'],
          ['Taux de collecte', '93.2%'],
        ].map(([a, b]) => (
          <article className="admin-stat-card" key={a}>
            <span>{a}</span>
            <strong>{b}</strong>
            <small>Septembre 2026</small>
          </article>
        ))}
      </div>

      <article className="admin-panel">
        <div className="admin-toolbar">
          <label className="admin-filter">
            <Search size={15} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une facture..."
            />
          </label>
          <select className="admin-select">
            <option>Septembre 2026</option>
            <option>Août 2026</option>
          </select>
        </div>

        <div className="admin-table invoice-table">
          <div className="admin-row admin-head">
            <span>Facture</span>
            <span>Organisation</span>
            <span>Montant</span>
            <span>Échéance</span>
            <span>Statut</span>
            <span className="text-right">Actions</span>
          </div>
          {rows.map((i) => (
            <div className="admin-row" key={i.id}>
              <button className="row-link" onClick={() => openModal && openModal('invoice', i)}>
                <FileText size={14} className="row-icon" />
                <b>{i.id}</b>
              </button>
              <span>{i.org}</span>
              <span className="amount-val">{i.amount}</span>
              <span>{i.due}</span>
              <div>
                <span className={`status-chip ${i.status === 'Payée' ? 'active' : 'warning'}`}>
                  {i.status}
                </span>
              </div>
              <div className="row-actions text-right">
                <button
                  className="row-action text-btn"
                  onClick={() => {
                    if (openModal) openModal('invoice', i)
                    else notify(`Détail de ${i.id}`)
                  }}
                >
                  Voir
                </button>
                {i.status !== 'Payée' && (
                  <button
                    className="row-action text-btn highlight"
                    onClick={() => {
                      setInvoices(
                        invoices.map((x) =>
                          x.id === i.id ? { ...x, status: 'Payée' } : x
                        )
                      )
                      notify('Facture marquée comme payée')
                    }}
                  >
                    Payer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </article>
    </>
  )
}