'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'

export function PlatformTableView({ title, subtitle, columns, rows, notify }) {
  return (
    <>
      <AdminHeading
        title={title}
        subtitle={subtitle}
        action={
          <button className="primary-button" onClick={() => notify('Formulaire de création ouvert')}>
            <Plus size={16} />
            Nouveau
          </button>
        }
      />

      <GlassCard as="article" className="adm-panel">
        <div className="adm-table" style={{ '--cols': `1.4fr repeat(${columns.length - 1}, 1fr)` }}>
          <div className="adm-row adm-head">
            {columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {rows.map((row) => (
            <button type="button" className="adm-row adm-row-btn" key={row} onClick={() => notify('Détail ouvert')}>
              {row.split(' · ').map((p, i) => (i === 0 ? <strong key={p}>{p}</strong> : <span key={p}>{p}</span>))}
            </button>
          ))}
        </div>
      </GlassCard>
    </>
  )
}
