// src/modules/admin/components/AuditAdmin.jsx
'use client'

import React from 'react'
import { Activity, Building2, Clock3, RefreshCw, UserRound } from 'lucide-react'
import { useAuditLogs } from '@/modules/business-tools/hooks/useAuditLogs'

export function AuditAdmin({ setDrawer }) {
  const { logs, loading, error, refresh } = useAuditLogs()

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return 'Date indisponible'
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    return String(formatter.format(d))
  }

  const formatAction = (action) => {
    const value = String(action || 'Événement')
    return value.replaceAll('_', ' ').toLocaleLowerCase('fr-FR')
  }

  return (
    <section className="ad-audit">
      <div className="ad-head ad-audit-head">
        <div>
          <span className="ad-audit-kicker"><Activity size={14} /> TRAÇABILITÉ</span>
          <h2>Journal des activités sensibles</h2>
          <p>Consultez les actions enregistrées, leur auteur et leur horodatage.</p>
        </div>
        <div className="ad-audit-toolbar">
          <button type="button" className="icon-button" onClick={refresh} title="Actualiser les journaux" aria-label="Actualiser les journaux">
            <RefreshCw size={16} />
          </button>
          <button type="button" className="secondary-button" onClick={() => setDrawer('audit-export')}>
            Exporter le journal
          </button>
        </div>
      </div>

      {loading && <p className="drawer-lead">Chargement du journal d’audit…</p>}
      {error && <p className="form-error" role="alert">Erreur : {error}</p>}

      {!loading && !error && (
        <div className="ad-audit-list">
          {logs.length > 0 ? (
            logs.map((log) => (
              <article className="ad-audit-entry" key={log.id}>
                <span className={`ad-audit-result ${log.resultat === 'ECHEC' ? 'failed' : 'success'}`} aria-label={log.resultat === 'ECHEC' ? 'Échec' : 'Succès'}>
                  <Activity size={16} />
                </span>
                <div className="ad-audit-main">
                  <div className="ad-audit-title">
                    <strong>{formatAction(log.action)}</strong>
                    <span className={`ad-audit-badge ${log.resultat === 'ECHEC' ? 'failed' : 'success'}`}>
                      {log.resultat === 'ECHEC' ? 'Échec' : 'Succès'}
                    </span>
                  </div>
                  <div className="ad-audit-meta">
                    <span><UserRound size={13} /> {log.utilisateur_nom || log.utilisateur_email || (log.utilisateur ? `Compte ${log.utilisateur}` : 'Système')}</span>
                    {log.utilisateur_nom && log.utilisateur_email && <span>{log.utilisateur_email}</span>}
                    {log.organisation_nom && <span><Building2 size={13} /> {log.organisation_nom}</span>}
                    <span>{log.ressource}{log.identifiant_ressource ? ` · ${log.identifiant_ressource}` : ''}</span>
                  </div>
                  <time className="ad-audit-time" dateTime={log.date_action}>
                    <Clock3 size={13} /> {formatDate(log.date_action)}
                  </time>
                </div>
              </article>
            ))
          ) : (
            <p className="ad-audit-empty">Aucun événement enregistré dans le journal d’audit.</p>
          )}
        </div>
      )}
    </section>
  )
}