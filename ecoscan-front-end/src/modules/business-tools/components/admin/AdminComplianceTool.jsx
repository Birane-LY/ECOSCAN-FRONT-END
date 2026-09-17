'use client'

import React, { useState } from 'react'
import { AlertTriangle, ArrowUpRight, Check, Database, FileCheck2, Gauge, Link2, MoreHorizontal, Plus, ShieldCheck, Trash2, Users } from 'lucide-react'
import { TeamAdmin } from './TeamAdmin'
import { SecurityAdmin } from './SecurityAdmin'
import { AlertsAdmin } from './AlertsAdmin'
import { IntegrationsAdmin } from './IntegrationsAdmin'
import { AuditAdmin } from './AuditAdmin'

const SECTIONS = [
  { id: 'overview', label: 'Vue admin', icon: Gauge },
  { id: 'team', label: 'Équipe & rôles', icon: Users },
  { id: 'security', label: 'Sécurité', icon: ShieldCheck },
  { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
  { id: 'integrations', label: 'Intégrations', icon: Link2 },
  { id: 'audit', label: 'Journal d\'audit', icon: FileCheck2 },
]

const LAUNCH_CHECKLIST = [
  { label: 'Profil organisation complété', done: true },
  { label: 'Deux administrateurs désignés', done: true },
  { label: 'Alertes critiques configurées', done: true },
  { label: 'Clé API de production créée', done: false },
]

export function AdminComplianceTool({ setDrawer }) {
  const [section, setSection] = useState('overview')
  const [twoFactor, setTwoFactor] = useState(true)
  const [alerts, setAlerts] = useState([
    { name: 'Consommation quotidienne', value: '500 kWh', active: true },
    { name: 'Coût mensuel', value: '250 000 FCFA', active: true },
    { name: 'Pic inhabituel', value: '+35% vs moyenne', active: false },
  ])

  return (
    <section className="admin-workspace">
      <aside className="admin-sidebar">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={section === id ? 'selected' : ''}
            onClick={() => setSection(id)}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </aside>

      <div className="admin-content">
        {section === 'overview' && (
          <>
            <div className="admin-hero">
              <div>
                <p className="eyebrow">CENTRE DE CONTRÔLE</p>
                <h2>Votre organisation, en ordre.</h2>
                <p>Gérez les accès, les données et les automatisations qui rendent EcoScan fiable au quotidien.</p>
              </div>
              <div className="security-score">
                <strong>92</strong>
                <span>score de confiance</span>
                <i style={{ width: '92%' }} />
              </div>
            </div>
            <div className="admin-kpis">
              <div><ShieldCheck size={17} /><strong>2FA activée</strong><span>Pour les administrateurs</span></div>
              <div><Users size={17} /><strong>8 membres actifs</strong><span>2 invitations en attente</span></div>
              <div><Database size={17} /><strong>100% synchronisé</strong><span>Dernière vérification il y a 4 min</span></div>
            </div>
            <div className="admin-checklist">
              <p className="eyebrow">PRÊT POUR LE LANCEMENT</p>
              {LAUNCH_CHECKLIST.map(({ label, done }) => (
                <button key={label} onClick={() => !done && setDrawer('api-key')}>
                  <span className={done ? 'check-done' : 'check-pending'}>
                    {done ? <Check size={13} /> : <Plus size={13} />}
                  </span>
                  <strong>{label}</strong>
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
          </>
        )}
        {section === 'team' && <TeamAdmin setDrawer={setDrawer} />}
        {section === 'security' && <SecurityAdmin twoFactor={twoFactor} setTwoFactor={setTwoFactor} setDrawer={setDrawer} />}
        {section === 'alerts' && <AlertsAdmin alerts={alerts} setAlerts={setAlerts} />}
        {section === 'integrations' && <IntegrationsAdmin setDrawer={setDrawer} />}
        {section === 'audit' && <AuditAdmin setDrawer={setDrawer} />}
      </div>
    </section>
  )
}
