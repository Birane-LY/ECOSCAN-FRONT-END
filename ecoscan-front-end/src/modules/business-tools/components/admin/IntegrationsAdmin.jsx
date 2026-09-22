import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { StatusChip } from '@/components/ui/StatusChip'

const INTEGRATIONS = [
  { name: 'Compteurs Woyofal', desc: 'Passerelle API Senelec', status: 'Connecté' },
  { name: 'Google Workspace', desc: 'Calendrier et rapports', status: 'Configuré' },
  { name: 'Slack', desc: 'Notifications d’équipe', status: 'Non configuré' },
]

export function IntegrationsAdmin({ setDrawer }) {
  return (
    <>
      <div className="ad-head">
        <h2>Connectez vos outils existants.</h2>
      </div>

      <div className="ad-list">
        {INTEGRATIONS.map(({ name, desc, status }) => (
          <div className="ad-row" key={name}>
            <div>
              <strong>{name}</strong>
              <small>{desc}</small>
            </div>
            <StatusChip status={status} />
            <button className="quiet-button" onClick={() => setDrawer(`integration-${name}`)}>
              Configurer <ArrowUpRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
