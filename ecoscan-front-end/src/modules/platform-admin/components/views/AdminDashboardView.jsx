'use client'

import React from 'react'
import { Activity, AlertTriangle, ArrowUpRight, Building2, CircleDollarSign, Download, Ticket, Users } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'

const STATS = [
  ['Organisations', '487', '+12 %', Building2],
  ['Utilisateurs actifs', '1 243', '+8 %', Users],
  ['MRR', '14,2 M', '+15 %', CircleDollarSign],
  ['Tickets ouverts', '23', '-5 %', Ticket],
  ['Disponibilité', '99,98 %', '+0,02 %', Activity],
]
const ALERTS = ['PME Dakar, consommation anormale détectée', 'Cabinet Conseil, ticket prioritaire', 'API Woyofal, taux d’erreur élevé']
const CHART = [42, 51, 48, 63, 71, 84, 77, 92]

export function AdminDashboardView({ select, notify, analytics = false }) {
  const peak = Math.max(...CHART)

  return (
    <>
      <AdminHeading
        title={analytics ? 'Analytics plateforme' : 'Bonjour Camille.'}
        subtitle={analytics ? 'Les indicateurs qui racontent la santé du produit.' : 'Voici la santé d’EcoScan, en un coup d’œil.'}
        action={
          <button className="primary-button" onClick={() => notify('Rapport exporté')}>
            <Download size={16} />
            Exporter
          </button>
        }
      />

      <div className="adm-stats">
        {STATS.map(([l, v, c, Icon]) => (
          <GlassCard as="article" className="adm-stat" key={l}>
            <Icon size={18} aria-hidden="true" />
            <span>{l}</span>
            <strong>{v}</strong>
            <small>{c} vs mois dernier</small>
          </GlassCard>
        ))}
      </div>

      <div className="adm-grid-2">
        <GlassCard as="article" className="adm-panel">
          <h2>{analytics ? 'MRR : 14,2 M FCFA' : 'La croissance garde son rythme.'}</h2>
          <div className="rb rb-compact adm-chart">
            <div className="rb-plot">
              <div className="rb-cols">
                {CHART.map((val, i) => (
                  <div className="rb-col" key={i} style={{ cursor: 'default' }}>
                    <i className="rb-v" style={{ height: `${(val / peak) * 100}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="adm-legend">
            Organisations <strong>487</strong> · MRR <strong>14,2 M FCFA</strong>
          </p>
        </GlassCard>

        <GlassCard as="article" className="adm-panel">
          <h2>Signaux récents</h2>
          <div className="adm-alerts">
            {ALERTS.map((x) => (
              <button type="button" className="adm-alert" onClick={() => notify(x)} key={x}>
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{x}</span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard as="article" className="adm-panel">
        <h2>Agir maintenant</h2>
        <div className="adm-quick">
          <button type="button" onClick={() => select('organizations')}>
            Valider une organisation <ArrowUpRight size={15} />
          </button>
          <button type="button" onClick={() => select('invoices')}>
            Voir les factures à relancer <ArrowUpRight size={15} />
          </button>
          <button type="button" onClick={() => select('reminders')}>
            Préparer une campagne <ArrowUpRight size={15} />
          </button>
        </div>
      </GlassCard>
    </>
  )
}
