'use client'

import React from 'react'
import { AdminHeading } from './AdminHeading'

const SERVICES = [
  'API Gateway · 120 ms',
  'Base de données · 42 connexions',
  'Jobs & queues · 3 jobs actifs',
  'Woyofal connector · 98.7% succès',
]

export function SystemHealthView({ notify }) {
  return (
    <>
      <AdminHeading
        eyebrow="INFRASTRUCTURE CONTROL"
        title="Santé système"
        subtitle="Une vue claire sur les services qui font tourner EcoScan."
        action={
          <button
            className="admin-secondary"
            onClick={() => notify('Diagnostics lancés')}
          >
            Lancer un diagnostic
          </button>
        }
      />

      <div className="health-banner">
        <i />
        Tous les systèmes sont opérationnels <b>99.98% uptime</b>
      </div>

      <div className="service-grid">
        {SERVICES.map((s) => (
          <article className="service-card" key={s}>
            <span>●</span>
            <strong>{s.split(' · ')[0]}</strong>
            <b>{s.split(' · ')[1]}</b>
            <small>Opérationnel</small>
          </article>
        ))}
      </div>
    </>
  )
}
