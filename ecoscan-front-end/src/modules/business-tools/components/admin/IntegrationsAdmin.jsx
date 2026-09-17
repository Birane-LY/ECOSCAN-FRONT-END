import React from 'react'
import { ArrowUpRight } from 'lucide-react'

const INTEGRATIONS = [
  { name: 'Compteurs Woyofal', desc: 'Passerelle API Senelec', status: 'Connecté' },
  { name: 'Google Workspace', desc: 'Calendrier et rapports', status: 'Configuré' },
  { name: 'Slack', desc: 'Notifications d\'équipe', status: 'Non configuré' },
]

export function IntegrationsAdmin({ setDrawer }) {
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">SERVICES TIERS</p>
          <h2>Connectez vos outils existants.</h2>
        </div>
      </div>

      <div className="integrations-list">
        {INTEGRATIONS.map(({ name, desc, status }) => (
          <div className="integration-row" key={name}>
            <div>
              <strong>{name}</strong>
              <span>{desc}</span>
            </div>
            <div className="integration-actions">
              <span className={`status-chip ${status === 'Connecté' ? 'ready' : ''}`}>
                {status}
              </span>
              <button className="quiet-button" onClick={() => setDrawer(`integration-${name}`)}>
                Configurer <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
