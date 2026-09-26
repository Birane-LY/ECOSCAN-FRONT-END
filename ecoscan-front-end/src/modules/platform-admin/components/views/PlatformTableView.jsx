'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'

export function PlatformTableView({ title, subtitle, columns, rows, notify, actionLabel, onAction }) {
  return (
    <>
      <AdminHeading
        title={title}
        subtitle={subtitle}
        action={onAction ? (
          <button className="primary-button" type="button" onClick={onAction}>
            <Plus size={16} />
            {actionLabel || 'Nouveau'}
          </button>
        ) : null}
      />

      <GlassCard as="article" className="adm-panel">
        <div className="adm-table" style={{ '--cols': `1.4fr repeat(${columns.length - 1}, 1fr)` }}>
          <div className="adm-row adm-head">
            {columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
                   {rows.map((row, rowIndex) => (
            <button type="button" className="adm-row adm-row-btn" key={`${row}-${rowIndex}`} onClick={() => notify('Détail ouvert')}>
              {row.split(' · ').map((p, i) => (i === 0 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))}
            </button>
          ))}
        </div>
      </GlassCard>
    </>
  )
}
