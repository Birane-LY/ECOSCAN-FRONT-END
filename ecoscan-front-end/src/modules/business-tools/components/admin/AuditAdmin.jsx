import React from 'react'

const AUDIT_LOGS = [
  ['Il y a 12 min', 'Camille Martin', 'Export du rapport comptable mensuel'],
  ['Hier, 18:40', 'Ousmane Diop', 'Mise à jour du seuil d\'alerte consommation'],
  ['10 sept.', 'Système', 'Synchronisation automatique des compteurs'],
  ['08 sept.', 'Camille Martin', 'Ajout de Fatou Ndiaye avec le rôle Lecture seule'],
]

export function AuditAdmin({ setDrawer }) {
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">TRAÇABILITÉ</p>
          <h2>Historique de toutes les activités sensibles.</h2>
        </div>
        <button className="secondary-button" onClick={() => setDrawer('audit-export')}>
          Exporter le journal
        </button>
      </div>

      <div className="audit-table">
        {AUDIT_LOGS.map(([date, user, action], i) => (
          <div className="audit-row" key={i}>
            <span className="audit-time">{date}</span>
            <span className="audit-user">{user}</span>
            <span className="audit-action">{action}</span>
          </div>
        ))}
      </div>
    </>
  )
}
