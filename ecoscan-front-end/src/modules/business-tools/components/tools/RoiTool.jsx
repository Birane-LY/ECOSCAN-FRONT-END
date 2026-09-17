'use client'

import React, { useState } from 'react'
import { Download, Zap } from 'lucide-react'
import { AccessDenied } from '@/modules/auth/components/AccessDenied'
import { apiPost } from '@/lib/apiClient'
import { useFicheProjet } from '@/modules/business-tools/hooks/useFicheProjet'
import {
  calculateROI,
  calculatePayback,
  calculateNetGain,
  ROI_PRESETS,
} from '@/modules/business-tools/services/roiCalculations'

export function RoiTool({ role, setDrawer }) {
  const { ficheProjet, loading: ficheLoading } = useFicheProjet()
  const [cost, setCost] = useState(500000)
  const [savings, setSavings] = useState(75000)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  const roi = calculateROI(cost, savings)
  const payback = calculatePayback(cost, savings)
  const netGain = calculateNetGain(cost, savings)
  const canExport = role === 'ADMIN_ORGANISATION' || role === 'UTILISATEUR_ORGANISATION'

  const handleExport = async () => {
    if (!ficheProjet) {
      setExportError("Aucune fiche projet trouvée pour votre organisation.")
      return
    }
    setExporting(true)
    setExportError(null)
    try {
      await apiPost('/energies/syntheses-financieres/', {
        fiche_projet: ficheProjet.id,
        cout_energie: cost,
        economie_estimee: savings * 12,
        economie_realisee: 0, // pas encore mesurée — la simulation est prospective
        retour_investissement: roi,
      })
      setDrawer('roi-export')
    } catch (err) {
      setExportError(err.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="tool-panel roi-tool">
      <div className="tool-panel-copy">
        <p className="eyebrow">AVANT D'INVESTIR</p>
        <h2>Votre prochaine action mérite un scénario.</h2>
        <p>Testez un investissement LED, climatisation ou machine avant de le présenter à votre équipe.</p>
        <div className="roi-presets">
          {ROI_PRESETS.map(({ name, cost: c, savings: s }) => (
            <button key={name} onClick={() => { setCost(c); setSavings(s) }}>
              <Zap size={14} />
              {name}
              <small>{s.toLocaleString('fr-FR')} FCFA/mois</small>
            </button>
          ))}
        </div>
      </div>

      <div className="roi-calculator">
        <label>
          Coût de mise en œuvre
          <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
          <span>FCFA</span>
        </label>
        <label>
          Gain mensuel estimé
          <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
          <span>FCFA</span>
        </label>

        <div className="roi-results">
          <div><span>ROI sur 12 mois</span><strong className={roi >= 0 ? 'positive' : 'negative'}>{roi}%</strong></div>
          <div><span>Temps de retour</span><strong>{payback}<small> mois</small></strong></div>
          <div><span>Gain net 12 mois</span><strong>{netGain.toLocaleString('fr-FR')}<small> FCFA</small></strong></div>
        </div>

        <div className="projection">
          <div className="projection-line">
            <i style={{ width: `${Math.min(100, Math.max(8, 100 / Number(payback || 1)))}%` }} />
            <span>Seuil de rentabilité · mois {payback}</span>
          </div>
          <div className="months">
            {Array.from({ length: 6 }, (_, i) => <span key={i}>M{i + 1}</span>)}
          </div>
        </div>

        {exportError && <p style={{ color: 'var(--copper)', fontSize: 11 }}>{exportError}</p>}

        {canExport ? (
          <button className="primary-button" onClick={handleExport} disabled={exporting || ficheLoading}>
            <Download size={16} />
            {exporting ? 'Enregistrement…' : 'Exporter la simulation'}
          </button>
        ) : (
          <AccessDenied role={role} />
        )}
      </div>
    </section>
  )
}