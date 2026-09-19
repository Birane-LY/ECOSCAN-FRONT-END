'use client'

import React from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  Download,
  Ticket,
  Users,
} from 'lucide-react'
import { AdminHeading } from './AdminHeading'

const STATS = [
  ['Organisations', '487', '+12%', Building2],
  ['Utilisateurs actifs', '1 243', '+8%', Users],
  ['MRR', '14.2M', '+15%', CircleDollarSign],
  ['Tickets ouverts', '23', '-5%', Ticket],
  ['Uptime', '99.98%', '+0.02%', Activity],
]

const ALERTS = [
  'PME Dakar · Consommation anormale détectée',
  'Cabinet Conseil · Ticket prioritaire',
  'API Woyofal · Taux d’erreur élevé',
]

export function AdminDashboardView({ select, notify, analytics = false }) {
  return (
    <>
      <AdminHeading
        eyebrow={analytics ? 'PLATFORM INTELLIGENCE' : 'PLATFORM CONTROL CENTER'}
        title={analytics ? 'Analytics plateforme' : 'Bonjour Camille.'}
        subtitle={
          analytics
            ? 'Les indicateurs qui racontent la santé du produit.'
            : 'Voici la santé d’EcoScan, en un coup d’œil.'
        }
        action={
          <button
            className="admin-primary"
            onClick={() => notify('Rapport exporté')}
          >
            <Download size={14} />
            Exporter
          </button>
        }
      />

      <div className="admin-stat-grid">
        {STATS.map(([l, v, c, Icon]) => (
          <article className="admin-stat" key={l}>
            <Icon size={17} />
            <span>{l}</span>
            <strong>{v}</strong>
            <small>{c} vs mois dernier</small>
          </article>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <article className="admin-panel">
          <small>TRAJECTOIRE PLATEFORME</small>
          <h2>{analytics ? 'MRR · 14.2M FCFA' : 'La croissance garde son rythme.'}</h2>
          <div className="admin-chart">
            {[42, 51, 48, 63, 71, 84, 77, 92].map((h, i) => (
              <i style={{ height: `${h}%` }} key={i} />
            ))}
          </div>
          <div className="admin-legend">
            Organisations <b>487</b>
            <span />
            MRR <b>14.2M FCFA</b>
          </div>
        </article>

        <article className="admin-panel">
          <small>À TRAITER</small>
          <h2>Signaux récents</h2>
          {ALERTS.map((x) => (
            <button
              className="admin-alert"
              onClick={() => notify(x)}
              key={x}
            >
              <AlertTriangle size={14} />
              {x}
              <ArrowUpRight size={13} />
            </button>
          ))}
        </article>
      </div>

      <article className="admin-panel">
        <small>RACCOURCIS OPÉRATIONNELS</small>
        <h2>Agir maintenant</h2>
        <div className="quick-actions">
          <button onClick={() => select('organizations')}>
            Valider une organisation <ArrowUpRight size={14} />
          </button>
          <button onClick={() => select('invoices')}>
            Voir les factures à relancer <ArrowUpRight size={14} />
          </button>
          <button onClick={() => select('reminders')}>
            Préparer une campagne <ArrowUpRight size={14} />
          </button>
        </div>
      </article>
    </>
  )
}
