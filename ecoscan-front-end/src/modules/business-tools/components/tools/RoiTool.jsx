'use client'

import React, { useState } from 'react'
import { Download, Zap } from 'lucide-react'
import { AccessDenied } from '@/modules/auth/components/AccessDenied'
import { apiPost } from '@/lib/apiClient'
import { GlassCard, TickProgress } from '@/components/instruments'
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
  const paybackNum = Number(payback)
  const within = paybackNum > 0 && paybackNum <= 12
  const canExport = role === 'ADMIN_ORGANISATION' || role === 'UTILISATEUR_ORGANISATION'

  const handleExport = async () => {
    if (!ficheProjet) {
      setExportError('Aucune fiche projet trouvée pour votre organisation.')
      return
    }
    setExporting(true)
    setExportError(null)
    try {
      await apiPost('/energies/syntheses-financieres/', {
        fiche_projet: ficheProjet.id,
        cout_energie: cost,
        economie_estimee: savings * 12,
        economie_realisee: 0, // simulation prospective : rien n'est encore mesuré
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
    <div className="roi">
      <div className="roi-intro">
        <h2>Votre prochaine action mérite un scénario.</h2>
        <p>Testez un investissement LED, climatisation ou machine avant de le présenter à votre équipe.</p>
        <div className="roi-presets" role="group" aria-label="Scénarios types">
          {ROI_PRESETS.map(({ name, cost: c, savings: s }) => (
            <button
              key={name}
              type="button"
              className={cost === c && savings === s ? 'on' : ''}
              onClick={() => {
                setCost(c)
                setSavings(s)
              }}
            >
              <Zap size={15} />
              <strong>{name}</strong>
              <small>{s.toLocaleString('fr-FR')} FCFA par mois</small>
            </button>
          ))}
        </div>
      </div>

      <GlassCard as="section" className="roi-calc">
        <div className="roi-fields">
          <label className="fld">
            Coût de mise en œuvre
            <span className="fld-unit">
              <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
              <em>FCFA</em>
            </span>
          </label>
          <label className="fld">
            Gain mensuel estimé
            <span className="fld-unit">
              <input type="number" value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
              <em>FCFA</em>
            </span>
          </label>
        </div>

        <div className="roi-results">
          <div>
            <span>ROI sur 12 mois</span>
            <strong className={roi >= 0 ? 'pos' : 'neg'}>{roi} %</strong>
          </div>
          <div>
            <span>Temps de retour</span>
            <strong>{payback} <small>mois</small></strong>
          </div>
          <div>
            <span>Gain net sur 12 mois</span>
            <strong>{netGain.toLocaleString('fr-FR')} <small>FCFA</small></strong>
          </div>
        </div>

        <div className="roi-proj">
          <TickProgress value={within ? (paybackNum / 12) * 100 : 100} ticks={12} label="Mois avant rentabilité" />
          <div className="roi-months" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <p>{within ? `Vous récupérez votre investissement au mois ${Math.ceil(paybackNum)}.` : 'Le retour sur investissement dépasse 12 mois.'}</p>
        </div>

        {exportError && <p className="form-error">{exportError}</p>}

        {canExport ? (
          <button className="primary-button" onClick={handleExport} disabled={exporting || ficheLoading}>
            <Download size={16} />
            {exporting ? 'Enregistrement…' : 'Exporter la simulation'}
          </button>
        ) : (
          <AccessDenied role={role} />
        )}
      </GlassCard>
    </div>
  )
}
