'use client'

import React, { useState } from 'react'
import { Building2, CheckCircle2, Download, Eye, FileCheck2, FileText, Rocket } from 'lucide-react'
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
    if (!ficheProjet) { setGenError("Aucune fiche projet trouvée pour votre organisation."); return }
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

  const dernierLivrable = [...livrables].sort((a, b) => new Date(b.date_generation) - new Date(a.date_generation))[0]

  return (
    <section className="reports-tool">
      <div className="template-grid">
        {TEMPLATES.map(({ id, title, desc, icon: Icon }) => (
          <button key={id} className={`template-card ${template === id ? 'selected' : ''}`} onClick={() => setTemplate(id)}>
            <Icon size={20} />
            <strong>{title}</strong>
            <span>{desc}</span>
            {template === id && <CheckCircle2 size={16} />}
          </button>
        ))}
      </div>

      <div className="report-builder">
        <div>
          <p className="eyebrow">CONFIGURATION DU LIVRABLE</p>
          <h2>Un rapport prêt à être partagé.</h2>
          <p>Sélectionnez une période, EcoScan génère le document à partir de vos données réelles.</p>
        </div>
        <div className="report-controls">
          <label>
            Période
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="month">Septembre 2026</option>
              <option value="quarter">T3 2026</option>
              <option value="year">Année 2026</option>
            </select>
          </label>
        </div>
        {genError && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{genError}</p>}
        <div className="report-actions">
          <button className="secondary-button" onClick={() => setDrawer('report-preview')}>
            <Eye size={15} />Prévisualiser
          </button>
          <button className="primary-button" onClick={handleGenerate} disabled={generating}>
            <Download size={15} />{generating ? 'Génération…' : 'Générer le rapport'}
          </button>
        </div>
      </div>

      <div className="report-history">
        <p className="eyebrow">HISTORIQUE</p>
        {loading && <p className="drawer-lead">Chargement…</p>}
        {error && <p className="drawer-lead">Erreur : {error}</p>}
        {!loading && !error && !dernierLivrable && <p className="drawer-lead">Aucun rapport généré pour le moment.</p>}
        {dernierLivrable && (
          <div>
            <FileCheck2 size={15} />
            <span>
              <strong>{dernierLivrable.nom}</strong>
              <small>{dernierLivrable.type} · {dernierLivrable.statut} · {new Date(dernierLivrable.date_generation).toLocaleDateString('fr-FR')}</small>
            </span>
            {dernierLivrable.url_fichier && (
              <a href={dernierLivrable.url_fichier} target="_blank" rel="noreferrer"><Download size={15} /></a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}