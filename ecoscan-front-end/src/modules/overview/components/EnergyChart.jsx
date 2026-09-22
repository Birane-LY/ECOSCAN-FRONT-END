'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { BigNumber, GlassCard, RangeBars } from '@/components/instruments'

const PERIODS = [
  { id: '7d', label: '7 jours' },
  { id: '30d', label: '30 jours' },
  { id: '90d', label: '90 jours' },
]

const fmt = (n) => Math.round(n || 0).toLocaleString('fr-FR')

function describe(d) {
  if (!d) return null
  const gap = d.target ? Math.round(((d.value - d.target) / d.target) * 100) : 0
  const txt = gap > 0 ? `${gap} % au-dessus de l’objectif` : `${Math.abs(gap)} % sous l’objectif`
  return { label: d.full, detail: `${fmt(d.value)} kWh, ${txt}` }
}

export function EnergyChart({
  period = '7d',
  setPeriod,
  setSelectedPoint,
  data: dataProp,
  loading = false,
}) {
  // ✅ Garantit que 'data' est toujours un tableau (gestion de null / undefined)
  const data = useMemo(() => (Array.isArray(dataProp) ? dataProp : []), [dataProp])

  // 1. Identification du pic de consommation sur les données réelles
  const peak = useMemo(() => {
    if (!data.length) return 0
    return data.reduce((best, d, i) => (d.value > (data[best]?.value || 0) ? i : best), 0)
  }, [data])

  const [sel, setSel] = useState(peak)
  const [showTarget, setShowTarget] = useState(true)

  useEffect(() => {
    setSel(peak)
    if (data[peak]) {
      setSelectedPoint?.(describe(data[peak]))
    } else {
      setSelectedPoint?.(null)
    }
  }, [data, peak, setSelectedPoint])

  const handleSelect = (i) => {
    setSel(i)
    if (data[i]) {
      setSelectedPoint?.(describe(data[i]))
    }
  }

  // 2. Calculs dynamiques sur les données réelles de l'API
  const total = useMemo(() => data.reduce((a, d) => a + (d.value || 0), 0), [data])
  const sumTarget = useMemo(() => data.reduce((a, d) => a + (d.target || 0), 0), [data])
  const gapPct = sumTarget ? Math.round(((total - sumTarget) / sumTarget) * 100) : 0

  const dynamicTrend = useMemo(() => {
    if (gapPct <= 0) return `↓ ${Math.abs(gapPct)} %`
    return `↑ ${gapPct} %`
  }, [gapPct])

  const current = data[sel]
  const hasData = data.length > 0

  return (
    <GlassCard as="section" className="chart" aria-label="Consommation dans le temps">
      <div className="chart-top">
        <h2>Votre énergie, en mouvement</h2>
        <div className="chart-tools">
          <div className="segmented" role="group" aria-label="Période">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-silent
                className={period === p.id ? 'selected' : ''}
                onClick={() => setPeriod?.(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-silent
            className="toggle-chip"
            aria-pressed={showTarget}
            onClick={() => setShowTarget((v) => !v)}
          >
            <i aria-hidden="true" />
            Comparer à l’objectif
          </button>
        </div>
      </div>

      <div className="chart-sum">
        <div>
          <BigNumber value={fmt(total)} unit="kWh" />
          <div className="hc-sub">Consommation totale sur la période</div>
        </div>
        {hasData && (
          <div className="hc-row">
            <span className={`chip ${gapPct <= 0 ? 'chip-ok' : 'chip-warn'}`}>
              {dynamicTrend}
            </span>
            <div className="chart-legend">
              <span>
                <i className="v" /> Consommation
              </span>
              {showTarget && (
                <span>
                  <i className="t" /> Objectif
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rendu conditionnel selon l'état de l'API */}
      <div className="chart-plot">
        {loading ? (
          <div className="chart-empty">Chargement des données en cours...</div>
        ) : !hasData ? (
          <div className="chart-empty">Aucune donnée enregistrée pour cette période.</div>
        ) : (
          <RangeBars data={data} selected={sel} onSelect={handleSelect} showTarget={showTarget} />
        )}
      </div>

      {hasData && (
        <div className="chart-foot">
          <div>
            <span className="k">Point sélectionné</span>
            <strong>{current?.full ?? '—'}</strong>
            <small>{current ? `${fmt(current.value)} kWh` : ''}</small>
          </div>
          <div>
            <span className="k">Écart à l’objectif</span>
            <strong>
              {gapPct > 0 ? '+' : ''}
              {gapPct} %
            </strong>
            <small>{gapPct > 0 ? 'Au-dessus de la cible sur la période' : 'Sous la cible sur la période'}</small>
          </div>
          <div>
            <span className="k">Pic de la période</span>
            <strong>{data[peak] ? `${fmt(data[peak].value)} kWh` : '—'}</strong>
            <small>{data[peak]?.full}</small>
          </div>
        </div>
      )}
    </GlassCard>
  )
}