'use client'

import React, { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import { statusTone } from './adminUi'
import apiClient from '@/lib/apiClient'

export function BillingView({ plans, setPlans, openModal, notify }) {
  const [renewals, setRenewals] = useState([])

  useEffect(() => {
    async function loadRenewals() {
      try {
        const res = await apiClient.get('/billing/renewals/')
        setRenewals(res.data)
      } catch {
        // Fallback si pas encore d'objets enregistrés
        setRenewals([])
      }
    }
    loadRenewals()
  }, [])

  const deletePlan = async (planId) => {
    try {
      await apiClient.delete(`/billing/plans/${planId}/`)
      setPlans(plans.filter((x) => x.id !== planId))
      notify('Plan supprimé')
    } catch {
      notify('Erreur lors de la suppression du plan')
    }
  }

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
            <strong className="adm-plan-price">{p.price === '0' || p.price === 0 ? 'Gratuit' : `${p.price} FCFA / mois`}</strong>
            <p>
              {p.active || 0} organisations actives, {p.seats || 'Illimité'} sièges
            </p>
            <div className="adm-actions">
              <button type="button" className="secondary-button" onClick={() => openModal('plan', p)}>
                <Pencil size={14} />
                Modifier
              </button>
              <button type="button" className="icon-button" onClick={() => deletePlan(p.id)} aria-label={`Supprimer le plan ${p.name}`}>
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
          {renewals.map((r, idx) => (
            <div className="adm-row" key={r.id || idx}>
              <strong>{r.org_name || r.name}</strong>
              <span>{r.plan}</span>
              <span>{r.due_date}</span>
              <span>{r.amount} FCFA</span>
              <span className={`chip ${statusTone(r.status)}`}>{r.status}</span>
            </div>
          ))}
          {renewals.length === 0 && <p className="drawer-lead">Aucun renouvellement prévu pour le moment.</p>}
        </div>
      </GlassCard>
    </>
  )
}