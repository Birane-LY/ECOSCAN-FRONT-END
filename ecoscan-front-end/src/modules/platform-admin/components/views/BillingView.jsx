'use client'

import React from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminHeading } from './AdminHeading'

const UPCOMING_RENEWALS = [
  ['PME Dakar', 'Enterprise', '12 sept.', '450 000 FCFA', 'À renouveler'],
  ['Sunu Foods', 'Enterprise', '18 sept.', '450 000 FCFA', 'Carte expirée'],
  ['Cabinet Conseil', 'Pro', '26 sept.', '29 000 FCFA', 'Actif'],
]

export function BillingView({ plans, setPlans, openModal, notify }) {
  return (
    <>
      <AdminHeading
        eyebrow="REVENUE OPERATIONS"
        title="Billing & plans"
        subtitle="Créez, modifiez et archivez vos offres d’abonnement."
        action={
          <button className="admin-primary" onClick={() => openModal('plan')}>
            <Plus size={14} />
            Nouveau plan
          </button>
        }
      />

      <div className="plan-cards">
        {plans.map((p) => (
          <article
            className={`plan-card ${p.name === 'Pro' ? 'blue' : ''}`}
            key={p.id}
          >
            <small>PLAN · {p.status.toUpperCase()}</small>
            <h2>{p.name}</h2>
            <strong>
              {p.price === '0' ? 'Gratuit' : `${p.price} FCFA / mois`}
            </strong>
            <p>
              {p.active} organisations actives · {p.seats} sièges
            </p>
            <ul>
              <li>✓ Analytics avancés</li>
              <li>✓ Support prioritaire</li>
              <li>✓ Essai {p.trial}</li>
            </ul>
            <div className="modal-actions">
              <button
                className="admin-secondary"
                onClick={() => openModal('plan', p)}
              >
                <Pencil size={13} />
                Modifier
              </button>
              <button
                className="admin-danger"
                onClick={() => {
                  setPlans(plans.filter((x) => x.id !== p.id))
                  notify('Plan archivé')
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <article className="admin-panel billing-table-panel">
        <small>ABONNEMENTS</small>
        <h2>Renouvellements à venir</h2>
        <div className="admin-table">
          <div className="admin-row admin-head">
            <span>Organisation</span>
            <span>Plan</span>
            <span>Échéance</span>
            <span>Montant</span>
            <span>Statut</span>
          </div>
          {UPCOMING_RENEWALS.map((r) => (
            <div className="admin-row" key={r[0]}>
              {r.map((v, i) =>
                i === 0 ? <b key={v}>{v}</b> : <span key={v}>{v}</span>
              )}
            </div>
          ))}
        </div>
      </article>
    </>
  )
}
