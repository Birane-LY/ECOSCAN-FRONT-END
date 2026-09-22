'use client'

import React, { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { apiGet, apiPatch } from '@/lib/apiClient'
import { EcoMark } from '@/components/instruments'
import { useRecommandations } from '@/modules/analyses/hooks/useRecommandations'
import { useDecisions } from '@/modules/analyses/hooks/useDecisions'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Titres et messages des tiroirs ouverts par les Outils métier
const NOTICES = {
  'new-analysis': {
    title: 'Nouvelle analyse',
    body: 'Importez une source de données pour lancer une nouvelle analyse.',
  },
  'roi-export': { title: 'Simulation enregistrée', body: 'Votre simulation de retour sur investissement a été ajoutée à la synthèse financière.' },
  'report-generated': { title: 'Rapport en préparation', body: 'Le rapport apparaît dans « Dernier rapport » dès qu’il est prêt.' },
  'report-preview': { title: 'Aperçu indisponible', body: 'La prévisualisation n’est pas encore disponible. Générez le rapport pour le consulter.' },
  'daily-summary': { title: 'Bilan de la journée', body: 'Votre bilan a bien été pris en compte.' },
  'daily-history': { title: 'Historique des relevés', body: 'L’historique complet arrive bientôt.' },
  'briefing-export': { title: 'Export iCal', body: 'L’export du calendrier arrive bientôt.' },
  'audit-export': { title: 'Export du journal', body: 'L’export du journal d’audit arrive bientôt.' },
  'api-key': { title: 'Clé API de production', body: 'La création de clés API arrive bientôt.' },
  sessions: { title: 'Sessions actives', body: 'La gestion des sessions arrive bientôt.' },
  password: { title: 'Mot de passe', body: 'Modifiez votre mot de passe depuis Paramètres, section Sécurité.' },
}

function PuissanceSouscriteRow({ compteur }) {
  const [valeur, setValeur] = useState(compteur.puissance_souscrite_kva ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await apiPatch(`/organisations/compteurs/${compteur.id}/`, {
        puissance_souscrite_kva: Number(valeur) || null,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dw-row">
      <div>
        <strong>{compteur.reference}</strong>
        <small>{compteur.type_energie}</small>
        {error && <small className="dw-err">{error}</small>}
      </div>
      <input
        type="number"
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        placeholder="kVA"
        aria-label={`Puissance souscrite de ${compteur.reference} en kVA`}
      />
      <button type="button" className="secondary-button" onClick={handleSave} disabled={saving}>
        {saving ? '…' : 'Enregistrer'}
      </button>
    </div>
  )
}

export function DetailDrawer({ type, close, complete }) {
  const [resultat, setResultat] = useState(null)
  const [importItem, setImportItem] = useState(null)
  const [sources, setSources] = useState([])
  const [compteurs, setCompteurs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAnalysisId = typeof type === 'string' && UUID_RE.test(type)
  const isImportRef = typeof type === 'string' && type.startsWith('import-')
  const importId = isImportRef ? type.replace('import-', '') : null
  const isOpportunities = type === 'opportunities'
  const isAllActions = type === 'all-actions'
  const isManageSources = type === 'manage-sources'
  const notice = NOTICES[type] || (typeof type === 'string' && type.startsWith('funding-') ? { title: type.replace('funding-', ''), body: 'Le détail du dossier de financement arrive bientôt.' } : null) || (typeof type === 'string' && type.startsWith('integration-') ? { title: type.replace('integration-', ''), body: 'La configuration de cette intégration arrive bientôt.' } : null)
  const isGeneric = !isAnalysisId && !isImportRef && !isOpportunities && !isAllActions && !isManageSources && !notice

  useEffect(() => {
    if (!type) return
    setResultat(null)
    setImportItem(null)
    setError(null)

    if (isAnalysisId) {
      setLoading(true)
      apiGet(`/analyses/resultats-metriques/${type}/`).then(setResultat).catch((e) => setError(e.message)).finally(() => setLoading(false))
    } else if (isImportRef && importId) {
      setLoading(true)
      apiGet(`/energies/imports/${importId}/`).then(setImportItem).catch((e) => setError(e.message)).finally(() => setLoading(false))
    }
  }, [type, isAnalysisId, isImportRef, importId])

  useEffect(() => {
    if (!isManageSources) return
    apiGet('/energies/sources-donnees/').then(setSources).catch(() => setSources([]))
    apiGet('/organisations/compteurs/').then(setCompteurs).catch(() => setCompteurs([]))
  }, [isManageSources])

  useEffect(() => {
    if (!type) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [type, close])

  if (!type) return null

  return (
    <div className="drawer-backdrop" onClick={close}>
      <aside className="dw" role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={(e) => e.stopPropagation()}>
        <header className="dw-head">
          <span className="dw-mark">
            <EcoMark size={20} />
          </span>
          <button type="button" className="icon-button" onClick={close} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>

        <div className="dw-body">
          {loading && <p className="drawer-lead">Chargement…</p>}
          {error && <p className="drawer-lead">Erreur : {error}</p>}

          {isManageSources && (
            <>
              <h2 id="drawer-title">Sources de données</h2>
              <p className="drawer-lead">Toutes les sources configurées pour votre organisation.</p>
              <div className="dw-list">
                {sources.map((s) => (
                  <div key={s.id} className="dw-row">
                    <div>
                      <strong>{s.nom}</strong>
                      <small>
                        {s.type}, {s.frequence}, {s.statut_synchronisation}
                      </small>
                    </div>
                  </div>
                ))}
                {sources.length === 0 && <p className="drawer-lead">Aucune source configurée.</p>}
              </div>

              {compteurs.length > 0 && (
                <>
                  <h3 className="dw-sub">Compteurs et puissance souscrite</h3>
                  <div className="dw-list">
                    {compteurs.map((c) => (
                      <PuissanceSouscriteRow key={c.id} compteur={c} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {!loading && !error && isAnalysisId && resultat && <ResultatMetriqueContent resultat={resultat} />}
          {!loading && !error && isImportRef && importItem && <ImportContent importItem={importItem} />}
          {isOpportunities && <OpportunitiesContent />}
          {isAllActions && <AllActionsContent />}

          {notice && (
            <>
              <h2 id="drawer-title">{notice.title}</h2>
              <p className="drawer-lead">{notice.body}</p>
            </>
          )}

          {isGeneric && !loading && !error && (
            <>
              <h2 id="drawer-title">{String(type)}</h2>
              <p className="drawer-lead">Aucun détail disponible pour cet élément.</p>
            </>
          )}
        </div>

        <footer className="dw-foot">
          {isGeneric ? (
            <>
              <button type="button" className="secondary-button" onClick={close}>
                Plus tard
              </button>
              <button type="button" className="primary-button" onClick={complete}>
                <Check size={16} /> Marquer comme décidé
              </button>
            </>
          ) : (
            <button type="button" className="secondary-button" onClick={close}>
              Fermer
            </button>
          )}
        </footer>
      </aside>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
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
          ? 'Résultat calculé de façon déterministe à partir de vos relevés validés.'
          : 'Ce résultat est encore en cours de qualification : la confiance à lui accorder est limitée.'}
      </p>
      <div className="dw-metrics">
        <Metric label="Valeur" value={resultat.valeur != null ? `${resultat.valeur} ${resultat.unite || ''}` : '—'} />
        <Metric label="Confiance" value={confiancePct != null ? `${confiancePct} %` : 'Non évaluée'} />
        <Metric label="Complétude" value={resultat.completude != null ? `${Math.round(resultat.completude * 100)} %` : '—'} />
      </div>
      {limites.length > 0 && (
        <div className="dw-section">
          <h3>Limites de ce résultat</h3>
          <ul>
            {limites.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      )}
      {sources.length > 0 && (
        <div className="dw-section">
          <h3>Sources utilisées</h3>
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
      <p className="drawer-lead">
        {importItem.type_donnees}, {importItem.format}, {importItem.nombre_lignes} lignes
      </p>
      <div className="dw-metrics">
        <Metric label="Statut" value={importItem.statut} />
        <Metric label="Score qualité" value={importItem.score_qualite != null ? `${importItem.score_qualite}/100` : '—'} />
      </div>
      {importItem.ocr_erreur && (
        <div className="dw-section">
          <h3>Erreur de lecture</h3>
          <p>{importItem.ocr_erreur}</p>
        </div>
      )}
    </>
  )
}

function OpportunitiesContent() {
  const { recommandations, loading, error, decider } = useRecommandations()
  const [decidingId, setDecidingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  const handleDecide = async (id) => {
    setDecidingId(id)
    setActionError(null)
    try {
      await decider(id)
    } catch (e) {
      setActionError(e.message)
    } finally {
      setDecidingId(null)
    }
  }

  return (
    <>
      <h2 id="drawer-title">Opportunités détectées</h2>
      <p className="drawer-lead">Recommandations issues de vos analyses, en attente d’une décision.</p>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {actionError && <p className="dw-err">{actionError}</p>}
      {!loading && !error && recommandations.length === 0 && <p className="drawer-lead">Aucune opportunité en attente pour le moment.</p>}

      <div className="dw-list">
        {recommandations.map((r) => (
          <div key={r.id} className="dw-row dw-top">
            <div>
              <strong>{r.titre}</strong>
              <small>{r.description}</small>
              {r.economie_estimee != null && (
                <small className="dw-impact">
                  Impact estimé : {r.economie_estimee} {r.unite}, priorité {r.priorite}
                </small>
              )}
            </div>
            <button type="button" className="secondary-button" disabled={decidingId === r.id} onClick={() => handleDecide(r.id)}>
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
  const [titres, setTitres] = useState({})

  useEffect(() => {
    // Toutes les recommandations (y compris décidées), uniquement pour résoudre les titres
    apiGet('/analyses/recommandations/')
      .then((all) => {
        const map = {}
        all.forEach((r) => {
          map[r.id] = r.titre
        })
        setTitres(map)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <h2 id="drawer-title">Toutes vos décisions</h2>
      <p className="drawer-lead">Historique complet des décisions prises sur vos recommandations.</p>

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {!loading && !error && decisions.length === 0 && <p className="drawer-lead">Aucune décision enregistrée pour le moment.</p>}

      <div className="dw-list">
        {decisions.map((d) => (
          <div key={d.id} className="dw-row dw-top">
            <div>
              <strong>{titres[d.recommandation] || 'Recommandation'}</strong>
              {d.commentaire && <small>{d.commentaire}</small>}
              <small>
                {d.resultat}, {d.decideur?.nom || 'Décideur inconnu'},{' '}
                {d.date_decision ? new Date(d.date_decision).toLocaleDateString('fr-FR') : '—'}
              </small>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
