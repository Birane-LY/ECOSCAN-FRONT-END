'use client'

import React, { useMemo, useState } from 'react'
import {
  Download,
  History,
  Lightbulb,
  TrendingDown,
  Wallet,
} from 'lucide-react'

import { AccessDenied } from '@/modules/auth/components/AccessDenied'
import { apiPost } from '@/lib/apiClient'
import { GlassCard, TickProgress } from '@/components/instruments'

import { useFicheProjet } from '@/modules/business-tools/hooks/useFicheProjet'
import { useSynthesesFinancieres } from '@/modules/business-tools/hooks/useSynthesesFinancieres'

import {
  calculateROI,
  calculatePayback,
  calculateNetGain,
} from '@/modules/business-tools/services/roiCalculations'

export function RoiTool({ role, setDrawer }) {
  const { ficheProjet, loading: ficheLoading } = useFicheProjet()

  const {
    syntheses,
    loading: synthesesLoading,
    reload: reloadSyntheses,
  } = useSynthesesFinancieres(ficheProjet?.id)

  const [cost, setCost] = useState(500000)
  const [monthlyBill, setMonthlyBill] = useState(250000)
  const [savingRate, setSavingRate] = useState(30)

  const [actionType, setActionType] = useState('Éclairage LED')

  const [selectedSyntheseId, setSelectedSyntheseId] = useState(null)

  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  const savings = useMemo(() => {
    const bill = Number(monthlyBill) || 0
    const rate = Number(savingRate) || 0

    return Math.round((bill * rate) / 100)
  }, [monthlyBill, savingRate])

  const roi = calculateROI(cost, savings)
  const payback = calculatePayback(cost, savings)
  const netGain = calculateNetGain(cost, savings)

  const paybackNum = Number(payback)
  const within = paybackNum > 0 && paybackNum <= 12

  const annualSavings = savings * 12

  const canExport =
    role === 'ADMIN_ORGANISATION' ||
    role === 'UTILISATEUR_ORGANISATION'

  const formatFCFA = (value) =>
    Number(value || 0).toLocaleString('fr-FR')

  const updateScenario = (setter, value) => {
    setter(value)
    setSelectedSyntheseId(null)
    setExportError(null)
  }

  const appliquerSynthese = (synthese) => {
    const investissement = Number(synthese.cout_energie) || 0
    const economieAnnuelle =
      Number(synthese.economie_estimee) || 0

    const economieMensuelle = Math.round(
      economieAnnuelle / 12
    )

    setCost(investissement)

    if (economieMensuelle > 0) {
      setMonthlyBill(
        Math.round(economieMensuelle / 0.3)
      )
      setSavingRate(30)
    } else {
      setMonthlyBill(250000)
      setSavingRate(0)
    }

    setSelectedSyntheseId(synthese.id)
    setExportError(null)
  }

  const handleExport = async () => {
    if (!ficheProjet) {
      setExportError(
        "Aucune fiche projet trouvée pour votre organisation."
      )
      return
    }

    if (cost <= 0) {
      setExportError(
        "Veuillez renseigner un investissement supérieur à 0 FCFA."
      )
      return
    }

    if (monthlyBill <= 0) {
      setExportError(
        "Veuillez renseigner votre dépense énergétique mensuelle."
      )
      return
    }

    if (savingRate <= 0) {
      setExportError(
        "Veuillez renseigner une économie attendue supérieure à 0 %."
      )
      return
    }

    setExporting(true)
    setExportError(null)

    try {
      await apiPost('/energies/syntheses-financieres/', {
        fiche_projet: ficheProjet.id,
        cout_energie: cost,
        economie_estimee: savings * 12,
        economie_realisee: 0,
        retour_investissement: roi,
      })

      await reloadSyntheses()
      setDrawer('roi-export')
    } catch (err) {
      setExportError(
        err?.message ||
          "Une erreur est survenue lors de l'enregistrement du scénario."
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="roi">
      <div className="roi-intro">
        <div className="roi-intro-heading">
          <span className="roi-kicker">
            <Lightbulb size={15} />
            Scénario énergétique
          </span>

          <h2>
            Mesurez ce que votre investissement pourrait vous rapporter.
          </h2>

          <p>
            Partez de votre dépense énergétique actuelle,
            indiquez l’investissement envisagé et estimez
            l’économie attendue. EcoScan vous montre ensuite
            en combien de temps votre investissement pourrait
            être récupéré.
          </p>
        </div>

        {syntheses.length > 0 && (
          <div
            className="roi-presets"
            role="group"
            aria-label="Vos scénarios précédents"
          >
            <div className="roi-history-title">
              <History size={15} />
              <span>Vos scénarios précédents</span>
            </div>

            <div className="roi-history-list">
              {syntheses.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={
                    selectedSyntheseId === s.id ? 'on' : ''
                  }
                  onClick={() => appliquerSynthese(s)}
                >
                  <History size={15} />

                  <span>
                    <strong>
                      {s.date_creation
                        ? new Date(
                            s.date_creation
                          ).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })
                        : `Scénario ${s.id}`}
                    </strong>

                    <small>
                      {formatFCFA(s.cout_energie)} FCFA investis
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!synthesesLoading && syntheses.length === 0 && (
          <div className="roi-empty-history">
            <History size={15} />

            <span>
              Aucun scénario enregistré pour l'instant.
              Construisez votre première simulation ci-dessous.
            </span>
          </div>
        )}
      </div>

      <GlassCard
        as="section"
        className="roi-calc"
      >
        <div className="roi-section">
          <div className="roi-section-heading">
            <span className="roi-step">01</span>

            <div>
              <h3>Votre situation actuelle</h3>

              <p>
                Quelle dépense énergétique souhaitez-vous
                réduire ?
              </p>
            </div>
          </div>

          <div className="roi-context-card">
            <div className="roi-context-icon">
              <Wallet size={19} />
            </div>

            <div className="roi-context-content">
              <span>
                Dépense énergétique moyenne
              </span>

              <strong>
                {formatFCFA(monthlyBill)}
                <small> FCFA / mois</small>
              </strong>

              <p>
                Soit environ{' '}
                <b>
                  {formatFCFA(monthlyBill * 12)} FCFA
                </b>{' '}
                par an.
              </p>
            </div>

            <div className="roi-inline-field">
              <input
                type="number"
                min="0"
                value={monthlyBill}
                onChange={(e) =>
                  updateScenario(
                    setMonthlyBill,
                    Number(e.target.value)
                  )
                }
                aria-label="Dépense énergétique mensuelle"
              />

              <em>FCFA / mois</em>
            </div>
          </div>
        </div>

        <div className="roi-section">
          <div className="roi-section-heading">
            <span className="roi-step">02</span>

            <div>
              <h3>Votre investissement</h3>

              <p>
                Quelle action souhaitez-vous évaluer ?
              </p>
            </div>
          </div>

          <div className="roi-fields">
            <label className="fld">
              <span className="fld-label">
                Action envisagée
              </span>

              <select
                value={actionType}
                onChange={(e) =>
                  updateScenario(
                    setActionType,
                    e.target.value
                  )
                }
              >
                <option>Éclairage LED</option>
                <option>
                  Optimisation de la climatisation
                </option>
                <option>
                  Équipement plus performant
                </option>
                <option>Installation solaire</option>
                <option>
                  Optimisation des usages
                </option>
                <option>
                  Autre action énergétique
                </option>
              </select>
            </label>

            <label className="fld">
              <span className="fld-label">
                Investissement envisagé
              </span>

              <span className="fld-unit">
                <input
                  type="number"
                  min="0"
                  value={cost}
                  onChange={(e) =>
                    updateScenario(
                      setCost,
                      Number(e.target.value)
                    )
                  }
                />

                <em>FCFA</em>
              </span>
            </label>
          </div>
        </div>

        <div className="roi-section">
          <div className="roi-section-heading">
            <span className="roi-step">03</span>

            <div>
              <h3>L'économie attendue</h3>

              <p>
                Quel niveau de réduction pensez-vous
                pouvoir atteindre ?
              </p>
            </div>
          </div>

          <div className="roi-saving-card">
            <div className="roi-saving-main">
              <div className="roi-saving-value">
                <strong>
                  {savingRate}
                  <small>%</small>
                </strong>

                <span>
                  d'économie estimée
                </span>
              </div>

              <div className="roi-saving-result">
                <TrendingDown size={18} />

                <div>
                  <span>
                    Cela représente environ
                  </span>

                  <strong>
                    {formatFCFA(savings)}
                    <small>
                      {' '}
                      FCFA économisés / mois
                    </small>
                  </strong>
                </div>
              </div>
            </div>

            <label className="roi-range">
              <span>
                Économie attendue
              </span>

              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={savingRate}
                onChange={(e) =>
                  updateScenario(
                    setSavingRate,
                    Number(e.target.value)
                  )
                }
              />

              <div className="roi-range-values">
                <span>0 %</span>
                <span>40 %</span>
                <span>80 %</span>
              </div>
            </label>
          </div>
        </div>

        <div className="roi-scenario-summary">
          <div className="roi-summary-label">
            <span>Votre scénario</span>

            <strong>{actionType}</strong>
          </div>

          <div className="roi-summary-flow">
            <div>
              <small>Dépense actuelle</small>

              <strong>
                {formatFCFA(monthlyBill)}
                <small> FCFA/mois</small>
              </strong>
            </div>

            <span className="roi-arrow">→</span>

            <div>
              <small>Économie attendue</small>

              <strong>
                {formatFCFA(savings)}
                <small> FCFA/mois</small>
              </strong>
            </div>

            <span className="roi-arrow">→</span>

            <div>
              <small>Investissement</small>

              <strong>
                {formatFCFA(cost)}
                <small> FCFA</small>
              </strong>
            </div>
          </div>
        </div>

        <div className="roi-results">
          <div className="roi-result-main">
            <span>Retour sur investissement</span>

            <strong
              className={
                roi >= 0 ? 'pos' : 'neg'
              }
            >
              {roi} %
            </strong>

            <small>sur 12 mois</small>
          </div>

          <div>
            <span>Investissement récupéré en</span>

            <strong>
              {payback}
              <small> mois</small>
            </strong>
          </div>

          <div>
            <span>Économie sur 12 mois</span>

            <strong>
              {formatFCFA(annualSavings)}
              <small> FCFA</small>
            </strong>
          </div>

          <div>
            <span>Gain net après investissement</span>

            <strong>
              {formatFCFA(netGain)}
              <small> FCFA</small>
            </strong>
          </div>
        </div>

        <div className="roi-proj">
          <div className="roi-proj-heading">
            <div>
              <span>Projection sur 12 mois</span>

              <strong>
                {within
                  ? `Retour attendu au mois ${Math.ceil(
                      paybackNum
                    )}`
                  : 'Retour supérieur à 12 mois'}
              </strong>
            </div>

            <span className="roi-proj-badge">
              {within
                ? 'Investissement récupéré'
                : 'Projection > 12 mois'}
            </span>
          </div>

          <TickProgress
            value={
              within
                ? (paybackNum / 12) * 100
                : 100
            }
            ticks={12}
            label="Mois avant récupération de l'investissement"
          />

          <div
            className="roi-months"
            aria-hidden="true"
          >
            {Array.from(
              { length: 12 },
              (_, i) => (
                <span key={i}>
                  {i + 1}
                </span>
              )
            )}
          </div>

          <p>
            {within
              ? `Avec une économie estimée à ${formatFCFA(
                  savings
                )} FCFA par mois, votre investissement de ${formatFCFA(
                  cost
                )} FCFA serait récupéré autour du mois ${Math.ceil(
                  paybackNum
                )}.`
              : 'Avec les hypothèses actuelles, le retour sur votre investissement dépasse 12 mois.'}
          </p>
        </div>

        {exportError && (
          <p className="form-error">
            {exportError}
          </p>
        )}

        {canExport ? (
          <div className="roi-action">
            <div className="roi-action-help">
              <strong>
                Ce scénario vous convient ?
              </strong>

              <span>
                Enregistrez-le pour le retrouver
                dans vos scénarios financiers.
              </span>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={handleExport}
              disabled={
                exporting || ficheLoading
              }
            >
              <Download size={16} />

              {exporting
                ? 'Enregistrement…'
                : 'Enregistrer ce scénario'}
            </button>
          </div>
        ) : (
          <AccessDenied role={role} />
        )}
      </GlassCard>
    </div>
  )
}

