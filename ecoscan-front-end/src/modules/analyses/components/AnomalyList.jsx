'use client'

import React, { useState } from 'react'
import { AlertTriangle, ArrowRight, Check, X } from 'lucide-react'
import { apiPost } from '@/lib/apiClient'

const SEVERITE = {
  SURVEILLANCE: { label: 'Surveillance', cls: '' },
  ALERTE: { label: 'Alerte', cls: 'chip-warn' },
  INVESTIGATION_PRIORITAIRE: { label: 'Investigation prioritaire', cls: 'chip-alert' },
}

const TYPE = {
  consumption_spike: 'Hausse de consommation',
  consumption_drop: 'Baisse de consommation',
}

export function AnomalyList({ anomalies = [], onChanged, onCreateReco }) {
  const [busyId, setBusyId] = useState(null)
  const [confiance, setConfiance] = useState({})
  const [error, setError] = useState(null)

  const agir = async (anomalieId, requete) => {
    setBusyId(anomalieId)
    setError(null)
    try {
      await requete()
      onChanged?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  if (anomalies.length === 0) {
    return (
      <p className="dec-empty">
        Aucune anomalie détectée. Elles apparaissent dès qu&apos;une consommation s&apos;écarte de plus de 10 % de sa référence
        (facture précédente à 30-60 jours, ou moyenne des 7 jours précédents pour un compteur Woyofal).
      </p>
    )
  }

  return (
    <section className="dc-section glass" aria-label="Anomalies détectées">
      <div className="panel-top">
        <h2>Anomalies détectées</h2>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="dc-list">
        {anomalies.map((a) => {
          const sev = SEVERITE[a.severite] || { label: a.severite, cls: '' }
          const ecart = Number(a.ecart_pourcentage)
          const h = a.hypothese
          const occupe = busyId === a.id
          return (
            <div key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="dc-row">
                <span className="dc-file-icon">
                  <AlertTriangle size={18} />
                </span>
                <span className="dc-file-name">
                  <strong>{TYPE[a.type] || a.type}</strong>
                  <small>
                    {Number.isFinite(ecart) ? `${ecart > 0 ? '+' : ''}${ecart.toLocaleString('fr-FR')} % par rapport à la référence` : ''}
                  </small>
                </span>
                <span className={`chip ${sev.cls}`}>{sev.label}</span>
                <span className="dc-file-time">
                  {a.date_detection ? new Date(a.date_detection).toLocaleDateString('fr-FR') : ''}
                </span>
              </div>

              <div style={{ paddingLeft: 46, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {!h && (
                  <small className="drawer-lead">
                    Diagnostic en cours. Il apparaîtra dès que l&apos;analyse de votre facture sera terminée.
                  </small>
                )}

                {h && (
                  <small style={{ lineHeight: 1.5 }}>
                    {h.texte}
                  </small>
                )}

                {h?.statut === 'PROPOSEE' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: 11 }}>
                      Évaluation terrain :{' '}
                      <select
                        value={confiance[a.id] ?? 0.7}
                        onChange={(e) => setConfiance((c) => ({ ...c, [a.id]: Number(e.target.value) }))}
                      >
                        <option value={0.9}>Élevée</option>
                        <option value={0.7}>Moyenne</option>
                        <option value={0.4}>Faible</option>
                      </select>
                    </label>
                    <button
                      className="row-action"
                      disabled={occupe}
                      onClick={() => agir(a.id, () => apiPost(`/analyses/hypotheses/${h.id}/confirmer/`, { confiance: confiance[a.id] ?? 0.7 }))}
                    >
                      <Check size={13} /> Confirmer
                    </button>
                    <button
                      className="row-action"
                      disabled={occupe}
                      onClick={() => agir(a.id, () => apiPost(`/analyses/hypotheses/${h.id}/rejeter/`))}
                    >
                      <X size={13} /> Rejeter
                    </button>
                  </div>
                )}

                {h?.statut === 'REJETEE' && <span className="chip">Diagnostic écarté</span>}

                {a.recommandations && a.recommandations.length > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderLeft: '4px solid var(--accent, #3b82f6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <strong style={{ fontSize: 13 }}>
                        {a.recommandations[0].titre}
                      </strong>
                      <span className={`chip ${a.recommandations[0].statut === 'DECIDEE' ? 'chip-ok' : 'chip-warn'}`}>
                        {a.recommandations[0].statut === 'DECIDEE' ? 'Décidée / Validée' : 'En attente de validation'}
                      </span>
                    </div>

                    <small style={{ color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5 }}>
                      {a.recommandations[0].description}
                    </small>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ok, #10b981)' }}>
                        Impact estimé : {Number(a.recommandations[0].economie_estimee || 0).toLocaleString('fr-FR')} {a.recommandations[0].unite || 'FCFA'}
                      </span>
                      {a.recommandations[0].statut !== 'DECIDEE' && (
                        <button
                          type="button"
                          className="primary-button"
                          style={{ fontSize: 12, padding: '5px 12px' }}
                          disabled={occupe}
                          onClick={() =>
                            agir(a.id, () => apiPost(`/analyses/recommandations/${a.recommandations[0].id}/marquer-comme-decidee/`))
                          }
                        >
                          <Check size={13} /> Valider cette recommandation
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {h?.statut === 'CONFIRMEE' && (!a.recommandations || a.recommandations.length === 0) && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                    <button
                      type="button"
                      className="primary-button"
                      style={{ fontSize: 12, padding: '5px 12px' }}
                      disabled={occupe}
                      onClick={() => agir(a.id, () => apiPost(`/analyses/anomalies/${a.id}/generer-recommandation-ia/`))}
                    >
                      <ArrowRight size={13} /> Générer une recommandation
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ fontSize: 12, padding: '5px 12px' }}
                      onClick={() => onCreateReco?.(a)}
                    >
                      Saisie manuelle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
