// src/modules/admin/components/AdminComplianceTool.jsx
'use client'

import React, { useState } from 'react'
import { AlertTriangle, ArrowUpRight, Check, Database, FileCheck2, Gauge, Link2, Plus, ShieldCheck, ShieldAlert, Users } from 'lucide-react'
import { ArcGauge, GlassCard } from '@/components/instruments'
import { TeamAdmin } from './TeamAdmin'
import { SecurityAdmin } from './SecurityAdmin'
import { AlertsAdmin } from './AlertsAdmin'
import { IntegrationsAdmin } from './IntegrationsAdmin'
import { AuditAdmin } from './AuditAdmin'

const SECTIONS = [
  { id: 'overview', label: 'Vue admin', icon: Gauge },
  { id: 'team', label: 'Équipe et rôles', icon: Users },
  { id: 'security', label: 'Sécurité', icon: ShieldCheck },
  { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
  { id: 'integrations', label: 'Intégrations', icon: Link2 },
  { id: 'audit', label: 'Journal d’audit', icon: FileCheck2 },
]

const LAUNCH_CHECKLIST = [
  { label: 'Profil organisation complété', done: true },
  { label: 'Deux administrateurs désignés', done: true },
  { label: 'Alertes critiques configurées', done: true },
  { label: 'Clé API de production créée', done: false },
]

export function AdminComplianceTool({ currentUser, setDrawer }) {
  const [section, setSection] = useState('overview')
  const [twoFactor, setTwoFactor] = useState(true)
  const [alerts, setAlerts] = useState([
    { name: 'Consommation quotidienne', value: '500 kWh', active: true },
    { name: 'Coût mensuel', value: '250 000 FCFA', active: true },
    { name: 'Pic inhabituel', value: '+35 % vs moyenne', active: false },
  ])

  //  Contrôle d'accès strict : Seul ADMIN_ORGANISATION
  const isOrgAdmin = currentUser?.role === 'ADMIN_ORGANISATION'

  if (!isOrgAdmin) {
    return (
      <GlassCard as="section" className="ad-content">
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <ShieldAlert size={48} style={{ color: 'var(--accent-amber, #f59e0b)', marginBottom: '1rem' }} />
          <h2>Accès strictement réservé à l'Admin d'Organisation</h2>
          <p className="drawer-lead">
            Conformément à la politique de confidentialité, les super-administrateurs de la plateforme n'ont pas accès à la gestion interne ni aux membres des organisations.
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="ad">
      <nav className="ad-nav glass" aria-label="Sections d’administration">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={section === id ? 'on' : ''} aria-current={section === id ? 'page' : undefined} onClick={() => setSection(id)}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <GlassCard as="section" className="ad-content">
        {section === 'overview' && (
          <>
            <div className="ad-hero">
              <div>
                <h2>Votre organisation, en ordre.</h2>
                <p>Gérez les accès, les données et les automatisations qui rendent EcoScan fiable au quotidien.</p>
              </div>
              <ArcGauge value={92} unit="" label="score de confiance" size={210} />
            </div>

            <div className="ad-kpis">
              <div>
                <ShieldCheck size={18} />
                <strong>2FA activée</strong>
                <span>Pour les administrateurs</span>
              </div>
              <div>
                <Users size={18} />
                <strong>Membres de l'organisation</strong>
                <span>Gestion centralisée</span>
              </div>
              <div>
                <Database size={18} />
                <strong>100 % synchronisé</strong>
                <span>Dernière vérification il y a 4 min</span>
              </div>
            </div>

            <div className="ad-checklist">
              <h3>Prêt pour le lancement</h3>
              {LAUNCH_CHECKLIST.map(({ label, done }) => (
                <button key={label} type="button" disabled={done} onClick={() => !done && setDrawer('api-key')}>
                  <span className={done ? 'done' : 'todo'}>{done ? <Check size={14} /> : <Plus size={14} />}</span>
                  <strong>{label}</strong>
                  {!done && <ArrowUpRight size={15} />}
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
      </GlassCard>
    </div>
  )
}