'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'

export function PlatformTableView({ title, subtitle, columns, rows, actionLabel, onAction, renderActions }) {
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
          {rows.map((row, rowIndex) => {
            const values = Array.isArray(row) ? row : row.split(' · ')
            return (
              <div className="adm-row" key={`${values.join('-')}-${rowIndex}`}>
                {values.map((value, index) => (
                  index === 0
                    ? <strong key={index}>{value}</strong>
                    : <span key={index}>{value}</span>
                ))}
                {renderActions && <span className="adm-row-actions">{renderActions(row, rowIndex)}</span>}
              </div>
            )
          })}
          {rows.length === 0 && (
            <p className="drawer-lead" style={{ padding: '1rem' }}>Aucune donnée à afficher.</p>
          )}
        </div>
      </GlassCard>
    </>
  )
}
