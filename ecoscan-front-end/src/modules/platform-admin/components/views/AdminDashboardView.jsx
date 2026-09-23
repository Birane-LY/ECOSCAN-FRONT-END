'use client'

import React, { useEffect, useState } from 'react'
import { Activity, AlertTriangle, ArrowUpRight, Building2, CircleDollarSign, Download, Ticket, Users } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import apiClient from '@/lib/apiClient'

export function AdminDashboardView({ select, notify, analytics = false }) {
  const [metrics, setMetrics] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const [statsRes, alertsRes, chartRes] = await Promise.all([
          apiClient.get('/admin/metrics/').catch(() => ({
            data: { orgs: 0, users: 0, mrr: '0 M', tickets: 0, uptime: '100%' }
          })),
          apiClient.get('/admin/alerts/').catch(() => ({ data: [] })),
          apiClient.get('/admin/mrr-chart/').catch(() => ({ data: [0, 0, 0, 0] }))
        ])

        setMetrics(statsRes.data)
        setAlerts(alertsRes.data)
        setChartData(chartRes.data)
      } catch (err) {
        notify('Erreur lors du chargement du tableau de bord')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [notify])

  const stats = [
    ['Organisations', metrics?.orgs ?? '-', metrics?.orgs_growth ?? '+0%', Building2],
    ['Utilisateurs actifs', metrics?.users ?? '-', metrics?.users_growth ?? '+0%', Users],
    ['MRR', metrics?.mrr ? `${metrics.mrr} FCFA` : '-', metrics?.mrr_growth ?? '+0%', CircleDollarSign],
    ['Tickets ouverts', metrics?.tickets ?? '-', metrics?.tickets_growth ?? '0%', Ticket],
    ['Disponibilité', metrics?.uptime ?? '99,9%', metrics?.uptime_change ?? '0%', Activity],
  ]

  const peak = Math.max(...chartData, 1)

  if (loading) {
    return <div className="p-8 text-center">Chargement des indicateurs...</div>
  }

  return (
    <>
      <AdminHeading
        title={analytics ? 'Analytics plateforme' : 'Vue d\'ensemble plateforme'}
        subtitle={analytics ? 'Les indicateurs qui racontent la santé du produit.' : 'Voici la santé globale du système en temps réel.'}
        action={
          <button className="primary-button" onClick={() => notify('Rapport exporté')}>
            <Download size={16} />
            Exporter
          </button>
        }
      />

      <div className="adm-stats">
        {stats.map(([l, v, c, Icon]) => (
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
          <h2>{analytics ? `MRR : ${metrics?.mrr || '0'} FCFA` : 'Évolution des revenus (MRR)'}</h2>
          <div className="rb rb-compact adm-chart">
            <div className="rb-plot">
              <div className="rb-cols">
                {chartData.map((val, i) => (
                  <div className="rb-col" key={i} style={{ cursor: 'default' }}>
                    <i className="rb-v" style={{ height: `${(val / peak) * 100}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="adm-legend">
            Organisations <strong>{metrics?.orgs}</strong> · MRR <strong>{metrics?.mrr} FCFA</strong>
          </p>
        </GlassCard>

        <GlassCard as="article" className="adm-panel">
          <h2>Signaux récents</h2>
          <div className="adm-alerts">
            {alerts.length === 0 && <p className="drawer-lead">Aucun signal ou anomalie détectée.</p>}
            {alerts.map((alertItem) => (
              <button type="button" className="adm-alert" onClick={() => notify(alertItem.message)} key={alertItem.id || alertItem.message}>
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{alertItem.message}</span>
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