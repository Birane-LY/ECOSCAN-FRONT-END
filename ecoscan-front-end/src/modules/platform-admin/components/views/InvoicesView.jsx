'use client'

import React, { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import { statusTone } from './adminUi'
import { filterInvoices } from '../../services/adminServices'

export function InvoicesView({ invoices, setInvoices, notify, openModal }) {
  const [q, setQ] = useState('')
  const rows = filterInvoices(invoices, q)

  return (
    <>
      <AdminHeading
        title="Factures mensuelles"
        subtitle="Suivez les échéances, paiements et anomalies de recouvrement."
        action={
          <button className="primary-button" onClick={() => notify('Registre exporté')}>
            <Download size={16} />
            Exporter
          </button>
        }
      />

      <div className="adm-stats compact">
        {[
          ['À encaisser', '1,84 M FCFA'],
          ['Payées', '12,36 M FCFA'],
          ['En retard', '3'],
          ['Taux de collecte', '93,2 %'],
        ].map(([a, b]) => (
          <GlassCard as="article" className="adm-stat" key={a}>
            <span>{a}</span>
            <strong>{b}</strong>
            <small>Septembre 2026</small>
          </GlassCard>
        ))}
      </div>

      <GlassCard as="article" className="adm-panel">
        <div className="adm-toolbar">
          <label className="fd-search">
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une facture…" aria-label="Rechercher une facture" />
          </label>
          <select className="st-select" aria-label="Période">
            <option>Septembre 2026</option>
            <option>Août 2026</option>
          </select>
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
              <span>{i.org}</span>
              <span>{i.amount}</span>
              <span>{i.due}</span>
              <span className={`chip ${statusTone(i.status)}`}>{i.status}</span>
              <span className="adm-row-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => (openModal ? openModal('invoice', i) : notify(`Détail de ${i.id}`))}
                >
                  Voir
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setInvoices(invoices.map((x) => (x.id === i.id ? { ...x, status: 'Payée' } : x)))
                    notify('Facture marquée comme payée')
                  }}
                >
                  Payer
                </button>
              </span>
            </div>
          ))}
          {rows.length === 0 && <p className="drawer-lead">Aucune facture ne correspond à cette recherche.</p>}
        </div>
      </GlassCard>
    </>
  )
}
