'use client'

import React, { useState } from 'react'
import { Building2, Check, Download, Eye, FileCheck2, FileText, Rocket } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { useFicheProjet } from '@/modules/business-tools/hooks/useFicheProjet'
import { useLivrables } from '@/modules/business-tools/hooks/useLivrables'

const TEMPLATES = [
  { id: 'accountant', title: 'Comptable', desc: 'Bilan formel et vérifiable', icon: FileText },
  { id: 'bank', title: 'Banque', desc: 'Dossier de financement', icon: Building2 },
  { id: 'investor', title: 'Investisseur', desc: 'Business case convaincant', icon: Rocket },
]

const PERIOD_LABELS = { month: 'Septembre 2026', quarter: 'T3 2026', year: '2026' }

export function ReportsTool({ setDrawer, template, setTemplate, period, setPeriod }) {
  const { ficheProjet } = useFicheProjet()
  const { livrables, loading, error, genererRapport } = useLivrables()
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  const handleGenerate = async () => {
    if (!ficheProjet) {
      setGenError('Aucune fiche projet trouvée pour votre organisation.')
      return
    }
    setGenerating(true)
    setGenError(null)
    try {
      await genererRapport({ ficheProjetId: ficheProjet.id, template, periodLabel: PERIOD_LABELS[period] })
      setDrawer('report-generated')
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  const dernier = [...livrables]
    .filter((l) => l.date_generation)
    .sort((a, b) => new Date(b.date_generation) - new Date(a.date_generation))[0]

  return (
    <div className="rp">
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
            <span className="rp-template-icon">
              <Icon size={20} />
            </span>
            <strong>{title}</strong>
            <span>{desc}</span>
            {template === id && (
              <i className="rp-check">
                <Check size={14} />
              </i>
            )}
          </button>
        ))}
      </div>

      <GlassCard as="section" className="rp-builder">
        <div>
          <h2>Un rapport prêt à être partagé.</h2>
          <p>Choisissez une période : EcoScan génère le document à partir de vos données réelles.</p>
        </div>
        <label className="fld">
          Période
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="month">Septembre 2026</option>
            <option value="quarter">T3 2026</option>
            <option value="year">Année 2026</option>
          </select>
        </label>
        {genError && <p className="form-error">{genError}</p>}
        <div className="rp-actions">
          <button className="secondary-button" onClick={() => setDrawer('report-preview')}>
            <Eye size={16} />Prévisualiser
          </button>
          <button className="primary-button" onClick={handleGenerate} disabled={generating}>
            <Download size={16} />{generating ? 'Génération…' : 'Générer le rapport'}
          </button>
        </div>
      </GlassCard>

      <GlassCard as="section" className="rp-history">
        <h3>Dernier rapport</h3>
        {loading && <p className="drawer-lead">Chargement…</p>}
        {error && <p className="drawer-lead">Erreur : {error}</p>}
        {!loading && !error && !dernier && <p className="drawer-lead">Aucun rapport généré pour le moment.</p>}
        {dernier && (
          <div className="rp-last">
            <FileCheck2 size={20} />
            <span>
              <strong>{dernier.nom}</strong>
              <small>
                {dernier.type}, {dernier.statut}, {new Date(dernier.date_generation).toLocaleDateString('fr-FR')}
              </small>
            </span>
            {dernier.url_fichier && (
              <a className="icon-button" href={dernier.url_fichier} target="_blank" rel="noreferrer" aria-label="Télécharger le rapport">
                <Download size={16} />
              </a>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  )
}