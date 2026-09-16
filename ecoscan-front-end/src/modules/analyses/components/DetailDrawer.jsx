'use client'

import React, { useEffect, useState } from 'react'
import { Check, MoreHorizontal, Sparkles, X } from 'lucide-react'
import { apiGet } from '@/lib/apiClient'
import { useRecommandations } from '@/modules/analyses/hooks/useRecommandations'
import { useDecisions } from '@/modules/analyses/hooks/useDecisions'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const STATIC_TITLES = {
  'new-analysis': "Nouvelle analyse",
}

export function DetailDrawer({ type, close, complete }) {
  const [resultat, setResultat] = useState(null)
  const [importItem, setImportItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAnalysisId = typeof type === 'string' && UUID_RE.test(type)
  const isImportRef = typeof type === 'string' && type.startsWith('import-')
  const importId = isImportRef ? type.replace('import-', '') : null
  const isOpportunities = type === 'opportunities'
  const isAllActions = type === 'all-actions'

  useEffect(() => {
    setResultat(null); setImportItem(null); setError(null)
    if (isAnalysisId) {
      setLoading(true)
      apiGet(`/analysis/resultats-metriques/${type}/`).then(setResultat).catch((e) => setError(e.message)).finally(() => setLoading(false))
    } else if (isImportRef && importId) {
      setLoading(true)
      apiGet(`/energy/imports/${importId}/`).then(setImportItem).catch((e) => setError(e.message)).finally(() => setLoading(false))
    }
  }, [type, isAnalysisId, isImportRef, importId])

  if (!type) return null

  return (
    <div className="drawer-backdrop" onClick={close}>
      <aside className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <button className="icon-button" onClick={close} aria-label="Fermer"><X /></button>
          <span className="eyebrow">DÉTAIL</span>
          <button className="icon-button"><MoreHorizontal size={17} /></button>
        </div>

        <div className="drawer-content">
          <div className="drawer-icon"><Sparkles size={21} /></div>

          {loading && <p className="drawer-lead">Chargement…</p>}
          {error && <p className="drawer-lead">Erreur : {error}</p>}

          {!loading && !error && isAnalysisId && resultat && <ResultatMetriqueContent resultat={resultat} />}
          {!loading && !error && isImportRef && importItem && <ImportContent importItem={importItem} />}
          {isOpportunities && <OpportunitiesContent onClose={close} />}
          {isAllActions && <AllActionsContent />}

          {!loading && !error && STATIC_TITLES[type] && (
            <>
              <h2 id="drawer-title">{STATIC_TITLES[type]}</h2>
              <p className="drawer-lead">Importez une source de données pour lancer une nouvelle analyse.</p>
            </>
          )}

          {!loading && !error && !isAnalysisId && !isImportRef && !isOpportunities && !isAllActions && !STATIC_TITLES[type] && (
            <>
              <h2 id="drawer-title">{type}</h2>
              <p className="drawer-lead">Aucun détail disponible pour cet élément.</p>
            </>
          )}
        </div>

        {/* Le footer générique ne sert plus qu'aux écrans qui n'ont pas leur propre action */}
        {!isAnalysisId && !isImportRef && !isOpportunities && !isAllActions && (
          <div className="drawer-footer">
            <button className="secondary-button" onClick={close}>Plus tard</button>
            <button className="primary-button" onClick={complete}>
              <Check size={16} /> Marquer comme décidé
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function ResultatMetriqueContent({ resultat }) {
  const confiancePct = resultat.confiance != null ? Math.round(Number(resultat.confiance) * 100) : null
  const limites = Array.isArray(resultat.limites) ? resultat.limites : []
  const sources = Array.isArray(resultat.sources) ? resultat.sources : []

  return (
    <>
      <h2 id="drawer-title">{resultat.code_metrique?.replace(/_/g, ' ')}</h2>
      <p className="drawer-lead">
        {resultat.statut_qualite === 'FIABLE'
          ? "Résultat calculé de façon déterministe à partir de vos relevés validés."
          : "Ce résultat est encore en cours de qualification — la confiance à lui accorder est limitée."}
      </p>
      <div className="drawer-metrics">
        <div><span>Valeur</span><strong>{resultat.valeur != null ? `${resultat.valeur} ${resultat.unite || ''}` : '—'}</strong></div>
        <div><span>Confiance</span><strong>{confiancePct != null ? `${confiancePct}%` : 'Non évaluée'}</strong></div>
        <div><span>Complétude</span><strong>{resultat.completude != null ? `${Math.round(resultat.completude * 100)}%` : '—'}</strong></div>
      </div>
      {limites.length > 0 && (
        <div className="drawer-section">
          <p className="eyebrow">LIMITES DE CE RÉSULTAT</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted-foreground)', fontSize: 11, lineHeight: 1.6 }}>
            {limites.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      )}
      {sources.length > 0 && (
        <div className="drawer-section">
          <p className="eyebrow">SOURCES UTILISÉES</p>
          <p>{sources.join(', ')}</p>
        </div>
      )}
    </>
  )
}

function ImportContent({ importItem }) {
  return (
    <>
      <h2 id="drawer-title">{importItem.nom_fichier}</h2>
      <p className="drawer-lead">{importItem.type_donnees} · {importItem.format} · {importItem.nombre_lignes} lignes</p>
      <div className="drawer-metrics">
        <div><span>Statut</span><strong>{importItem.statut}</strong></div>
        <div><span>Score qualité</span><strong>{importItem.score_qualite != null ? `${importItem.score_qualite}/100` : '—'}</strong></div>
      </div>
      {importItem.ocr_erreur && (
        <div className="drawer-section"><p className="eyebrow">ERREUR OCR</p><p>{importItem.ocr_erreur}</p></div>
      )}
    </>
  )
}

function OpportunitiesContent({ onClose }) {
  const { recommandations, loading, error, decider } = useRecommandations()
  const [decidingId, setDecidingId] = useState(null)

  const handleDecide = async (id) => {
    setDecidingId(id)
    try {
      await decider(id)
    } catch (e) {
      // laisse l'erreur remonter visuellement plutôt que silencieusement
      alert(e.message)
    } finally {
      setDecidingId(null)
    }
  }

  return (
    <>
      <h2 id="drawer-title">Opportunités détectées</h2>
      <p className="drawer-lead">Recommandations générées à partir de vos analyses, en attente d'une décision.</p>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {!loading && !error && recommandations.length === 0 && (
        <p className="drawer-lead">Aucune opportunité en attente pour le moment.</p>
      )}

      <div className="drawer-section" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
       {recommandations.map((r) => (
          <div key={r.id} className="owner-row" style={{ alignItems: 'flex-start' }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong>{r.titre}</strong>
              <small>{r.description}</small>
              {r.economie_estimee != null && (
                <small style={{ color: 'var(--green)' }}>
                  Impact estimé : {r.economie_estimee} {r.unite} · priorité {r.priorite}
                </small>
              )}
            </span>
            <button
              className="secondary-button"
              disabled={decidingId === r.id}
              onClick={() => handleDecide(r.id)}
            >
              {decidingId === r.id ? '…' : 'Décider'}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

function AllActionsContent() {
  const { decisions, loading, error } = useDecisions()
  const [titresParRecommandation, setTitresParRecommandation] = useState({})

  useEffect(() => {
    // Toutes les recommandations (y compris DECIDEE), juste pour résoudre les titres —
    // séparé de useRecommandations() qui exclut volontairement les DECIDEE.
    apiGet('/analysis/recommandations/')
      .then((all) => {
        const map = {}
        all.forEach((r) => { map[r.id] = r.titre })
        setTitresParRecommandation(map)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <h2 id="drawer-title">Toutes vos décisions</h2>
      <p className="drawer-lead">Historique complet des décisions prises sur vos recommandations.</p>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {!loading && !error && decisions.length === 0 && (
        <p className="drawer-lead">Aucune décision enregistrée pour le moment.</p>
      )}

      <div className="drawer-section" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {decisions.map((d) => (
          <div key={d.id} className="owner-row" style={{ alignItems: 'flex-start' }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong>{titresParRecommandation[d.recommandation] || 'Recommandation'}</strong>
              {d.commentaire && <small>{d.commentaire}</small>}
              <small style={{ color: 'var(--muted-foreground)' }}>
                {d.resultat} · {d.decideur?.nom || 'Décideur inconnu'} ·{' '}
                {d.date_decision ? new Date(d.date_decision).toLocaleDateString('fr-FR') : '—'}
              </small>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}