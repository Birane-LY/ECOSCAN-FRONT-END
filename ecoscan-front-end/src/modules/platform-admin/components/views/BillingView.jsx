'use client'

import React from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import { statusTone } from './adminUi'

const UPCOMING_RENEWALS = [
  ['PME Dakar', 'Enterprise', '12 sept.', '450 000 FCFA', 'À renouveler'],
  ['Sunu Foods', 'Enterprise', '18 sept.', '450 000 FCFA', 'Carte expirée'],
  ['Cabinet Conseil', 'Pro', '26 sept.', '29 000 FCFA', 'Actif'],
]

export function BillingView({ plans, setPlans, openModal, notify }) {
  return (
    <>
      <AdminHeading
        title="Facturation et plans"
        subtitle="Créez, modifiez et archivez vos offres d’abonnement."
        action={
          <button className="primary-button" onClick={() => openModal('plan')}>
            <Plus size={16} />
            Nouveau plan
          </button>
        }
      />

      <div className="adm-plans">
        {plans.map((p) => (
          <GlassCard as="article" className="adm-plan" key={p.id}>
            <span className={`chip ${statusTone(p.status)}`}>{p.status}</span>
            <h2>{p.name}</h2>
            <strong className="adm-plan-price">{p.price === '0' ? 'Gratuit' : `${p.price} FCFA / mois`}</strong>
            <p>
              {p.active} organisations actives, {p.seats} sièges
            </p>
            <ul>
              <li>Analytics avancés</li>
              <li>Support prioritaire</li>
              <li>Essai {p.trial}</li>
            </ul>
            <div className="adm-actions">
              <button type="button" className="secondary-button" onClick={() => openModal('plan', p)}>
                <Pencil size={14} />
                Modifier
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  setPlans(plans.filter((x) => x.id !== p.id))
                  notify('Plan archivé')
                }}
                aria-label={`Archiver le plan ${p.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard as="article" className="adm-panel">
        <h2>Renouvellements à venir</h2>
        <div className="adm-table" style={{ '--cols': '1.6fr 1fr 1fr 1fr 1fr' }}>
          <div className="adm-row adm-head">
            <span>Organisation</span>
            <span>Plan</span>
            <span>Échéance</span>
            <span>Montant</span>
            <span>Statut</span>
          </div>
          {UPCOMING_RENEWALS.map((r) => (
            <div className="adm-row" key={r[0]}>
              <strong>{r[0]}</strong>
              <span>{r[1]}</span>
              <span>{r[2]}</span>
              <span>{r[3]}</span>
              <span className={`chip ${statusTone(r[4])}`}>{r[4]}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  )
}
