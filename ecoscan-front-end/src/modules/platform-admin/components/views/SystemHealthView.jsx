'use client'

import React from 'react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'

const SERVICES = [
  ['API Gateway', '120 ms'],
  ['Base de données', '42 connexions'],
  ['Tâches planifiées', '3 tâches actives'],
  ['Connecteur Woyofal', '98,7 % de succès'],
]

export function SystemHealthView({ notify }) {
  return (
    <>
      <AdminHeading
        title="Santé système"
        subtitle="Une vue claire sur les services qui font tourner EcoScan."
        action={
          <button className="secondary-button" onClick={() => notify('Diagnostics lancés')}>
            Lancer un diagnostic
          </button>
        }
      />

      <GlassCard as="p" className="adm-banner">
        Tous les systèmes sont opérationnels <strong>99,98 % de disponibilité</strong>
      </GlassCard>

      <div className="adm-services">
        {SERVICES.map(([name, value]) => (
          <GlassCard as="article" className="adm-service" key={name}>
            <strong>{name}</strong>
            <span>{value}</span>
            <small className="chip chip-ok">Opérationnel</small>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
