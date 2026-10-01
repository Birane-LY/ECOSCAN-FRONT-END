'use client'

import React, { useEffect, useState } from 'react'
import { Building2, Check, Download, FileCheck2, FileText, Rocket } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { apiDownload, apiGet } from '@/lib/apiClient'
import { useOrganisation } from '@/modules/business-tools/hooks/useOrganisation'
import { useLivrables } from '@/modules/business-tools/hooks/useLivrables'

const TEMPLATES = [
  { id: 'accountant', title: 'Comptable', desc: 'Bilan formel et vérifiable', icon: FileText },
  { id: 'bank', title: 'Banque', desc: 'Dossier de financement', icon: Building2 },
  { id: 'investor', title: 'Investisseur', desc: 'Business case convaincant', icon: Rocket },
]

const PERIOD_LABELS = { month: 'Septembre 2026', quarter: 'T3 2026', year: '2026' }

function toList(data, label) {
  const list = Array.isArray(data) ? data : data?.results
  if (!Array.isArray(list)) throw new Error(`Réponse inattendue du serveur pour ${label}.`)
  return list
}

export function ReportsTool({ setDrawer, template, setTemplate, period, setPeriod }) {
  const { organisation, loading: organisationLoading, error: organisationError } = useOrganisation()
  const { livrables, loading, error, genererRapport } = useLivrables()
  const [projects, setProjects] = useState([])
  const [memories, setMemories] = useState([])
  const [contentLoading, setContentLoading] = useState(true)
  const [contentError, setContentError] = useState(null)
  const [reportKind, setReportKind] = useState('energy')
  const [projectId, setProjectId] = useState('')
  const [memoryId, setMemoryId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  useEffect(() => {
    if (organisationLoading || !organisation?.id) return

    let cancelled = false
    Promise.all([
      apiGet('/organisations/projets/'),
      apiGet('/analyses/memoires-strategiques/'),
    ]).then(([projectData, memoryData]) => {
      if (cancelled) return
      setProjects(toList(projectData, 'les fiches projet'))
      setMemories(toList(memoryData, 'les mémoires stratégiques'))
      setContentError(null)
    }).catch((loadError) => {
      if (!cancelled) setContentError(loadError.message || 'Impossible de charger les éléments du rapport.')
    }).finally(() => {
      if (!cancelled) setContentLoading(false)
    })

    return () => { cancelled = true }
  }, [organisation, organisationLoading, organisationError])

  const handleGenerate = async () => {
    if (!organisation?.id) {
      setGenError('Aucune organisation associée à votre compte.')
      return
    }
    if (reportKind === 'memory' && !memoryId) {
      setGenError('Sélectionnez une mémoire stratégique à exporter.')
      return
    }
    setGenerating(true)
    setGenError(null)
    try {
      const selectedMemory = memories.find((memory) => memory.id === memoryId)
      await genererRapport({
        organisationId: organisation.id,
        ficheProjetId: reportKind === 'energy' ? projectId : null,
        memoireId: reportKind === 'memory' ? memoryId : null,
        type: reportKind === 'memory' ? 'MEMOIRE' : undefined,
        template,
        periodLabel: reportKind === 'memory'
          ? selectedMemory?.titre || 'Memoire'
          : PERIOD_LABELS[period],
      })
      setDrawer('report-generated')
    } catch (err) {
      setGenError(err.message || 'Impossible de générer le document.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!dernier?.id) return
    setDownloading(true)
    setDownloadError(null)
    try {
      const pdf = await apiDownload(`/analyses/livrables/${dernier.id}/telecharger/`)
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = `${dernier.nom || 'EcoScan-document'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setDownloadError(err.message || 'Impossible de télécharger le document.')
    } finally {
      setDownloading(false)
    }
  }

  const dernier = [...livrables]
    .filter((livrable) => livrable.date_generation)
    .sort((a, b) => new Date(b.date_generation) - new Date(a.date_generation))[0]
  const visibleContentLoading = organisationLoading || (Boolean(organisation?.id) && contentLoading)
  const visibleContentError = contentError || (
    !organisationLoading && !organisation?.id
      ? organisationError || 'Aucune organisation associée à votre compte.'
      : null
  )

  return (
    <div className="rp">
      <div className="rp-document-modes" role="group" aria-label="Type de document à générer">
        <button type="button" className={reportKind === 'energy' ? 'active' : ''} onClick={() => setReportKind('energy')}>
          <FileText size={17} />
          <span><strong>Rapport énergétique</strong><small>Données de l’organisation, sans fiche obligatoire</small></span>
        </button>
        <button type="button" className={reportKind === 'memory' ? 'active' : ''} onClick={() => setReportKind('memory')}>
          <Download size={17} />
          <span><strong>Exporter une mémoire</strong><small>Télécharger une mémoire stratégique en PDF</small></span>
        </button>
      </div>

      {reportKind === 'energy' && (
        <div className="rp-templates" role="radiogroup" aria-label="Destinataire du rapport">
          {TEMPLATES.map(({ id, title, desc, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={template === id}
              className={`rp-template glass ${template === id ? 'on' : ''}`}
              onClick={() => setTemplate(id)}
            >
              <span className="rp-template-icon"><Icon size={20} /></span>
              <strong>{title}</strong>
              <span>{desc}</span>
              {template === id && <i className="rp-check"><Check size={14} /></i>}
            </button>
          ))}
        </div>
      )}

      <GlassCard as="section" className="rp-builder">
        <div>
          <h2>{reportKind === 'memory' ? 'Exporter une mémoire stratégique.' : 'Un rapport prêt à être partagé.'}</h2>
          <p>
            {reportKind === 'memory'
              ? 'La mémoire sélectionnée sera mise en page dans un document PDF téléchargeable.'
              : 'Le rapport rassemble les données énergétiques disponibles pour votre organisation. Une fiche projet est facultative.'}
          </p>
        </div>
        {reportKind === 'energy' ? (
          <>
            <label className="fld">
              Fiche projet / contexte (facultatif)
              <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                <option value="">Toutes les données de l’organisation</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.nom}</option>)}
              </select>
            </label>
            <label className="fld">
              Période indicative
              <select value={period} onChange={(event) => setPeriod(event.target.value)}>
                <option value="month">Septembre 2026</option>
                <option value="quarter">T3 2026</option>
                <option value="year">Année 2026</option>
              </select>
            </label>
          </>
        ) : (
          <label className="fld">
            Mémoire stratégique
            <select value={memoryId} onChange={(event) => setMemoryId(event.target.value)}>
              <option value="">Choisir une mémoire à exporter</option>
              {memories.map((memory) => <option key={memory.id} value={memory.id}>{memory.titre} · {memory.statut}</option>)}
            </select>
          </label>
        )}
        {reportKind === 'memory' && !visibleContentLoading && !visibleContentError && memories.length === 0 && (
          <p className="drawer-lead">Aucune mémoire stratégique n’est encore disponible pour cette organisation.</p>
        )}
        {visibleContentLoading && <p className="drawer-lead">Chargement des données…</p>}
        {visibleContentError && <p className="form-error" role="alert">{visibleContentError}</p>}
        {genError && <p className="form-error" role="alert">{genError}</p>}
        <div className="rp-actions">
          <button
            className="primary-button"
            onClick={handleGenerate}
            disabled={generating || visibleContentLoading || Boolean(visibleContentError) || (reportKind === 'memory' && memories.length === 0)}
          >
            <Download size={16} />
            {generating ? 'Génération…' : reportKind === 'memory' ? 'Générer le PDF mémoire' : 'Générer le rapport énergétique'}
          </button>
        </div>
      </GlassCard>

      <GlassCard as="section" className="rp-history">
        <h3>Dernier document généré</h3>
        {loading && <p className="drawer-lead">Chargement…</p>}
        {error && <p className="drawer-lead">Erreur : {error}</p>}
        {!loading && !error && !dernier && <p className="drawer-lead">Aucun document généré pour le moment.</p>}
        {dernier && (
          <div className="rp-last">
            <FileCheck2 size={20} />
            <span>
              <strong>{dernier.nom}</strong>
              <small>{dernier.type}, {dernier.statut}, {new Date(dernier.date_generation).toLocaleDateString('fr-FR')}</small>
            </span>
            {dernier.url_fichier && (
              <button
                type="button"
                className="icon-button"
                onClick={handleDownload}
                disabled={downloading}
                aria-label={downloading ? 'Téléchargement du document en cours' : 'Télécharger le document généré'}
              >
                <Download size={16} />
              </button>
            )}
          </div>
        )}
        {downloadError && <p className="form-error" role="alert">{downloadError}</p>}
      </GlassCard>
    </div>
  )
}
