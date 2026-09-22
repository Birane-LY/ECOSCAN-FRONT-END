'use client'

import React, { useState } from 'react'
import { Check, Database, MessageSquareText, TrendingDown, TrendingUp, X } from 'lucide-react'
import { TickProgress } from '@/components/instruments'

const STATUT = {
  A_VERIFIER: { label: 'À vérifier', cls: 'chip-alert' },
  PARTIELLEMENT_CONFIRMEE: { label: 'Partiellement confirmée', cls: '' },
  CONFIRMEE: { label: 'Confirmée', cls: 'chip-ok' },
}
const fcfa = (v) => `${Number(v).toLocaleString('fr-FR')} FCFA`

function Section({ title, children }) {
  if (!children) return null
  return (
    <div className="md-section">
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  )
}

/** Panneau de détail (verre) : mémoire confirmée ou hypothèse à valider. */
export function MemoryDetail({ node, stats, onConfirm, onReject, onAsk, busy }) {
  const [confiance, setConfiance] = useState(0.7)

  if (!node || node.kind === 'hub') {
    return (
      <div className="md-empty">
        <h3>Ce qu’EcoScan a appris de votre organisation</h3>
        <p>
          Chaque diagnostic confirmé, avec une action menée et un impact mesuré, devient une mémoire durable que
          l’assistant réutilise. Touchez un point de la constellation pour lire son histoire.
        </p>
        <dl className="md-stats">
          <div>
            <dt>Mémoires</dt>
            <dd>{stats.total}</dd>
          </div>
          <div>
            <dt>Confirmées</dt>
            <dd>{stats.confirmed}</dd>
          </div>
          <div>
            <dt>Hypothèses en attente</dt>
            <dd>{stats.pending}</dd>
          </div>
        </dl>
      </div>
    )
  }

  if (node.kind === 'hypothese') {
    const h = node.raw
    return (
      <div className="md-body">
        <div className="md-top">
          <span className="chip">Hypothèse en attente</span>
        </div>
        <h3 className="md-title">Une hypothèse à valider</h3>
        <p className="md-text">{h.texte}</p>
        <label className="md-field">
          Confiance que vous lui accordez
          <select value={confiance} onChange={(e) => setConfiance(Number(e.target.value))}>
            <option value={0.9}>Élevée</option>
            <option value={0.7}>Moyenne</option>
            <option value={0.4}>Faible</option>
          </select>
        </label>
        <div className="md-actions">
          <button className="primary-button" disabled={busy} onClick={() => onConfirm(h.id, confiance)}>
            <Check size={16} /> Confirmer
          </button>
          <button className="secondary-button" disabled={busy} onClick={() => onReject(h.id)}>
            <X size={16} /> Rejeter
          </button>
        </div>
      </div>
    )
  }

  const m = node.raw
  const st = STATUT[m.statut] || { label: m.statut, cls: '' }
  const attendu = m.impact_attendu_fcfa != null ? Number(m.impact_attendu_fcfa) : null
  const mesure = m.impact_mesure_fcfa != null ? Number(m.impact_mesure_fcfa) : null
  const ecart = attendu != null && mesure != null ? mesure - attendu : null
  const taux = m.taux_realisation != null ? Number(m.taux_realisation) : null
  const date = m.date_creation
    ? new Date(m.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="md-body">
      <div className="md-top">
        <span className={`chip ${st.cls}`}>{st.label}</span>
        {date && <span className="md-date">{date}</span>}
      </div>
      <h3 className="md-title">{m.titre}</h3>

      <Section title="Signal initial">{m.signal_initial}</Section>
      <Section title="Hypothèse confirmée">{m.hypothese_texte}</Section>
      <Section title="Action menée">{m.action_texte}</Section>

      {(attendu != null || mesure != null) && (
        <div className="md-impact">
          <div>
            <span>Impact attendu</span>
            <strong>{attendu != null ? fcfa(attendu) : '—'}</strong>
          </div>
          <div>
            <span>Impact mesuré</span>
            <strong>{mesure != null ? fcfa(mesure) : 'Non mesuré'}</strong>
          </div>
          {taux != null && (
            <div className="md-taux">
              <span>Taux de réalisation : {taux} %</span>
              <TickProgress value={Math.min(100, taux)} ticks={24} label="Taux de réalisation" />
            </div>
          )}
          {ecart != null && (
            <p className={`md-ecart ${ecart >= 0 ? 'up' : 'down'}`}>
              {ecart >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {ecart >= 0 ? 'Impact réel supérieur à la prévision' : 'Impact réel inférieur à la prévision'} (
              {ecart >= 0 ? '+' : ''}
              {ecart.toLocaleString('fr-FR')} FCFA)
            </p>
          )}
        </div>
      )}

      {m.sources?.length > 0 && (
        <div className="md-sources">
          {m.sources.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="md-actions">
        {onAsk && (
          <button className="secondary-button" onClick={() => onAsk(`Que puis-je apprendre de « ${m.titre} » ?`)}>
            <MessageSquareText size={16} /> Interroger l’assistant
          </button>
        )}
        {m.indexee_rag && (
          <span className="chip chip-ok">
            <Database size={13} /> Connue de l’assistant
          </span>
        )}
      </div>
    </div>
  )
}
