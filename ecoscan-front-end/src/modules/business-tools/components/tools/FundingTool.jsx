'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Clock, ExternalLink, Landmark, RefreshCw, Search } from 'lucide-react'
import { apiGet } from '@/lib/apiClient'
import { GlassCard } from '@/components/instruments'
import { StatusChip } from '@/components/ui/StatusChip'
import { useFundingReview } from '@/modules/business-tools/hooks/useFundingReview'

const ADMIN_ROLES = ['ADMIN_ORGANISATION', 'SUPER_ADMIN']

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr-FR')
}

function formatAmount(amount, currency) {
  if (amount == null || amount === '') return 'Non précisé'
  const value = Number(amount)
  if (!Number.isFinite(value)) return 'Non précisé'
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)} ${currency || 'FCFA'}`
}

function formatDeadline(value) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date)
}

function getSafeSourceUrl(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

function FundingReviewQueue({ onPublished }) {
  const { loading, error, aVerifier, valider, rejeter, reload } = useFundingReview()
  const [deciding, setDeciding] = useState(null)
  const [actionError, setActionError] = useState(null)

  const decide = async (opportunity, action) => {
    setDeciding({ id: opportunity.id, action })
    setActionError(null)
    try {
      if (action === 'valider') {
        await valider(opportunity.id)
        onPublished()
      } else {
        await rejeter(opportunity.id)
      }
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeciding(null)
    }
  }

  return (
    <section className="fd-review" aria-labelledby="fd-review-title">
      <div className="fd-review-head">
        <div>
          <h2 id="fd-review-title">À vérifier avant publication</h2>
          <p>Les opportunités collectées sont relues ici avant d’être visibles dans le catalogue.</p>
        </div>
        <button type="button" className="icon-button" onClick={reload} disabled={loading} aria-label="Actualiser les opportunités à vérifier">
          <RefreshCw size={16} />
        </button>
      </div>

      {loading && <p className="fd-status" role="status">Chargement des opportunités à vérifier…</p>}
      {error && (
        <div className="fd-error" role="alert">
          <span>Impossible de charger les opportunités à vérifier : {error}</span>
          <button type="button" className="secondary-button" onClick={reload}>Réessayer</button>
        </div>
      )}
      {actionError && <p className="fd-status err" role="alert">{actionError}</p>}
      {!loading && !error && aVerifier.length === 0 && (
        <p className="fd-status">Aucune nouvelle opportunité n’attend de vérification.</p>
      )}

      {aVerifier.length > 0 && (
        <div className="fd-review-list">
          {aVerifier.map((opportunity) => (
            <article className="fd-review-item" key={opportunity.id}>
              <div className="fd-review-copy">
                <div className="fd-review-title">
                  <strong>{opportunity.titre}</strong>
                  <StatusChip status="À vérifier" />
                </div>
                <span className="fd-org">{opportunity.organisme}</span>
                <p>{opportunity.description || opportunity.criteres_eligibilite || 'Aucun détail fourni.'}</p>
                {getSafeSourceUrl(opportunity.url_source) && (
                  <a href={getSafeSourceUrl(opportunity.url_source)} target="_blank" rel="noreferrer">
                    Consulter la source <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div className="fd-review-actions">
                <button
                  type="button"
                  className="primary-button"
                  disabled={deciding !== null}
                  onClick={() => decide(opportunity, 'valider')}
                >
                  {deciding?.id === opportunity.id && deciding.action === 'valider' ? 'Publication…' : 'Publier'}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={deciding !== null}
                  onClick={() => decide(opportunity, 'rejeter')}
                >
                  {deciding?.id === opportunity.id && deciding.action === 'rejeter' ? 'Rejet…' : 'Rejeter'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function FundingTool({ role }) {
  const [query, setQuery] = useState('')
  const [catalog, setCatalog] = useState({ loading: true, error: null, opportunities: [] })
  const isAdmin = ADMIN_ROLES.includes(role)

  const reloadCatalog = useCallback(async () => {
    setCatalog((current) => ({ ...current, loading: true, error: null }))
    try {
      const opportunities = await apiGet('/analyses/opportunites-financement/')
      setCatalog({ loading: false, error: null, opportunities })
    } catch (err) {
      setCatalog({ loading: false, error: err.message, opportunities: [] })
    }
  }, [])

  useEffect(() => {
    let active = true
    apiGet('/analyses/opportunites-financement/')
      .then((opportunities) => {
        if (active) setCatalog({ loading: false, error: null, opportunities })
      })
      .catch((err) => {
        if (active) setCatalog({ loading: false, error: err.message, opportunities: [] })
      })

    return () => {
      active = false
    }
  }, [])

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return catalog.opportunities
    return catalog.opportunities.filter((opportunity) =>
      normalize([
        opportunity.organisme,
        opportunity.titre,
        opportunity.description,
        opportunity.criteres_eligibilite,
        opportunity.secteur,
      ].join(' ')).includes(q)
    )
  }, [catalog.opportunities, query])

  return (
    <div className="fd">
      {isAdmin && <FundingReviewQueue onPublished={reloadCatalog} />}

      <div className="fd-catalog-head">
        <div>
          <h2>Opportunités publiées</h2>
          <p>Les aides et subventions vérifiées, transmises par leurs organismes sources.</p>
        </div>
        <button type="button" className="icon-button" onClick={reloadCatalog} disabled={catalog.loading} aria-label="Actualiser le catalogue">
          <RefreshCw size={16} />
        </button>
      </div>

      <label className="fd-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par organisme, secteur ou critère"
          aria-label="Rechercher une opportunité de financement"
        />
      </label>

      {catalog.loading && <p className="fd-status" role="status">Chargement des aides et subventions…</p>}
      {catalog.error && (
        <div className="fd-error" role="alert">
          <span>Impossible de charger les opportunités : {catalog.error}</span>
          <button type="button" className="secondary-button" onClick={reloadCatalog}>Réessayer</button>
        </div>
      )}
      {!catalog.loading && !catalog.error && catalog.opportunities.length === 0 && (
        <p className="fd-status">Aucune opportunité publiée pour le moment. Revenez consulter le catalogue plus tard.</p>
      )}
      {!catalog.loading && !catalog.error && catalog.opportunities.length > 0 && results.length === 0 && (
        <p className="fd-status">Aucune opportunité ne correspond à « {query} ».</p>
      )}

      <div className="fd-grid">
        {results.map((opportunity) => {
          const deadline = formatDeadline(opportunity.date_limite)
          const sourceUrl = getSafeSourceUrl(opportunity.url_source)

          return (
            <GlassCard as="article" className="fd-card" key={opportunity.id}>
              <div className="fd-top">
                <span className="fd-logo" aria-hidden="true"><Landmark size={18} /></span>
                <StatusChip status="Publiée" />
              </div>
              <span className="fd-org">{opportunity.organisme}</span>
              <h3>{opportunity.titre}</h3>
              <p>{opportunity.description || 'Aucune description détaillée fournie.'}</p>

              <dl className="fd-meta">
                <div>
                  <dt>Montant maximum</dt>
                  <dd>{formatAmount(opportunity.montant_max, opportunity.devise)}</dd>
                </div>
                {opportunity.taux_financement_pct != null && (
                  <div>
                    <dt>Taux de financement</dt>
                    <dd>{Number(opportunity.taux_financement_pct).toLocaleString('fr-FR')} %</dd>
                  </div>
                )}
                {opportunity.secteur && (
                  <div>
                    <dt>Secteur</dt>
                    <dd>{opportunity.secteur}</dd>
                  </div>
                )}
              </dl>

              {deadline && (
                <div className="fd-deadline">
                  <Clock size={15} /> Date limite : {deadline}
                </div>
              )}

              {opportunity.criteres_eligibilite && (
                <details className="fd-more">
                  <summary>Consulter les critères d’éligibilité</summary>
                  <p>{opportunity.criteres_eligibilite}</p>
                </details>
              )}

              <div className="fd-actions">
                {sourceUrl ? (
                  <a className="primary-button fd-source" href={sourceUrl} target="_blank" rel="noreferrer">
                    Consulter l’offre <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <span className="fd-status">Source externe non renseignée</span>
                )}
                {sourceUrl && (
                  <a className="icon-button" href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`Ouvrir la source de ${opportunity.titre}`}>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
