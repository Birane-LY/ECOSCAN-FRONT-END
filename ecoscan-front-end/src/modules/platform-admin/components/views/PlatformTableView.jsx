'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { AdminHeading } from './AdminHeading'

export function PlatformTableView({
  title,
  eyebrow,
  subtitle,
  columns,
  rows,
  notify,
}) {
  return (
    <>
      <AdminHeading
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={
          <button
            className="admin-primary"
            onClick={() => notify('Formulaire de création ouvert')}
          >
            <Plus size={14} />
            Nouveau
          </button>
        }
      />

      <article className="admin-panel">
        <div className="admin-table">
          <div className="admin-row admin-head">
            {columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {rows.map((row) => (
            <button
              className="admin-row interactive"
              key={row}
              onClick={() => notify('Détail ouvert')}
            >
              {row.split(' · ').map((p, i) =>
                i === 0 ? <b key={p}>{p}</b> : <span key={p}>{p}</span>
              )}
            </button>
          ))}
        </div>
      </article>
    </>
  )
}