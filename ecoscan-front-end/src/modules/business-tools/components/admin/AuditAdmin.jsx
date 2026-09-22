// src/modules/admin/components/AuditAdmin.jsx
'use client'

import React from 'react'
import {  RefreshCw } from 'lucide-react'
import { useAuditLogs } from '@/modules/business-tools/hooks/useAuditLogs'

export function AuditAdmin({ setDrawer }) {
  const { logs, loading, error, refresh } = useAuditLogs()

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <div className="ad-head">
        <h2>Historique de toutes les activités sensibles.</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="icon-button" onClick={refresh} title="Actualiser les journaux">
            <RefreshCw size={16} />
          </button>
          <button className="secondary-button" onClick={() => setDrawer('audit-export')}>
            Exporter le journal
          </button>
        </div>
      </div>

      {loading && <p className="drawer-lead">Chargement du journal d’audit...</p>}
      {error && <p className="drawer-lead" style={{ color: 'var(--accent-red, #ef4444)' }}>Erreur : {error}</p>}

      {!loading && !error && (
        <div className="ad-list">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div className="ad-row ad-audit" key={log.id || log.timestamp}>
                <span className="ad-time">{formatDate(log.timestamp || log.date_creation)}</span>
                <div>
                  <strong>{log.action || log.description}</strong>
                  <small>{log.utilisateur_nom || log.utilisateur || 'Système'}</small>
                </div>
              </div>
            ))
          ) : (
            <p className="drawer-lead">Aucun événement enregistré dans le journal d'audit.</p>
          )}
        </div>
      )}
    </>
  )
}