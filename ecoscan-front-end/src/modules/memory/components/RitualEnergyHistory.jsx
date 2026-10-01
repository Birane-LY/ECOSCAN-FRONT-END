'use client'

import React from 'react'
import { BookOpen, Zap } from 'lucide-react'
import { getDailyIntervals, RITUAL_SLOTS } from '@/modules/business-tools/services/woyofalCalculations'
import { useRitualEnergyHistory } from '@/modules/memory/hooks/useRitualEnergyHistory'

const formatNumber = (value, maximumFractionDigits = 2) =>
  Number(value).toLocaleString('fr-FR', { maximumFractionDigits })

const formatDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const formatTime = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Heure inconnue'
    : date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function StoredPointDay({ entry, date }) {
  const { point, readings, recharges } = entry
  const intervals = getDailyIntervals({
    readings,
    mode: point.mode_mesure,
    recharges,
    date,
  })
  const readingsBySlot = new Map(readings.map((reading) => [reading.creneau, reading]))
  const modeLabel = point.mode_mesure === 'SOLDE_WOYOFAL'
    ? 'Woyofal · solde restant'
    : 'SENELEC · index cumulatif'

  return (
    <div className="ritual-history-point">
      <h4>{modeLabel} · {point.nom}</h4>
      <div className="ritual-history-readings">
        {RITUAL_SLOTS.map((slot) => {
          const reading = readingsBySlot.get(slot.time)
          return (
            <div key={slot.time}>
              <span>{slot.time}</span>
              <strong>{reading ? `${formatNumber(reading.valeur_kwh)} kWh` : 'Non relevé'}</strong>
              {reading?.note && <small>{reading.note}</small>}
            </div>
          )
        })}
      </div>
      <div className="ritual-history-intervals">
        {intervals.map((interval) => (
          <span key={`${interval.startTime}-${interval.endTime}`}>
            {interval.startTime}–{interval.endTime} · {interval.value == null
              ? 'non calculable'
              : `${formatNumber(interval.value)} kWh`}
          </span>
        ))}
      </div>
      {recharges.length > 0 && (
        <ul className="ritual-history-recharges">
          {recharges.map((recharge) => (
            <li key={recharge.id}>
              Recharge à {formatTime(recharge.effectuee_le)} · {formatNumber(recharge.kwh_credites, 3)} kWh
              {recharge.note ? ` · ${recharge.note}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function RitualEnergyHistory({ organisationId }) {
  const { days, points, loading, error, reload } = useRitualEnergyHistory(organisationId)
  const readingCount = days.reduce(
    (count, day) => count + [...day.points.values()].reduce((sum, point) => sum + point.readings.length, 0),
    0,
  )
  const rechargeCount = days.reduce(
    (count, day) => count + [...day.points.values()].reduce((sum, point) => sum + point.recharges.length, 0),
    0,
  )

  return (
    <section className="ritual-history glass" aria-labelledby="ritual-history-title">
      <div className="ritual-history-header">
        <div>
          <span className="ritual-history-kicker"><BookOpen size={15} /> JOURNAL OPÉRATIONNEL</span>
          <h2 id="ritual-history-title">Relevés énergétiques conservés</h2>
          <p>Historique des mesures, des recharges et des bilans quotidiens de l’organisation.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => void reload()} disabled={loading}>
          {loading ? 'Actualisation…' : 'Actualiser'}
        </button>
      </div>

      <p className="ritual-history-note">
        Ces données restent dans leur historique énergétique. Les mémoires stratégiques et l’assistant ne retiennent
        comme connaissances que les diagnostics validés.
      </p>

      {error && <p className="ritual-history-error" role="alert">{error}</p>}
      {!error && loading && <p className="ritual-history-empty">Chargement de l’historique…</p>}
      {!error && !loading && days.length === 0 && (
        <p className="ritual-history-empty">Aucun relevé rituel enregistré pour cette organisation.</p>
      )}
      {!error && !loading && days.length > 0 && (
        <>
          <div className="ritual-history-counts">
            <span><Zap size={14} /> {readingCount} relevé{readingCount > 1 ? 's' : ''}</span>
            <span>{rechargeCount} recharge{rechargeCount > 1 ? 's' : ''}</span>
            <span>{points.length} point{points.length > 1 ? 's' : ''} de suivi</span>
          </div>
          <div className="ritual-history-days">
            {days.map((day) => (
              <details className="ritual-history-day" key={day.date}>
                <summary>
                  <strong>{formatDate(day.date)}</strong>
                  <span>
                    {[...day.points.values()].reduce((sum, point) => sum + point.readings.length, 0)} relevé(s)
                    {' · '}
                    {[...day.points.values()].reduce((sum, point) => sum + point.recharges.length, 0)} recharge(s)
                  </span>
                </summary>
                {day.observations.map((observation) => (
                  <blockquote className="ritual-history-observation" key={observation.id}>
                    {observation.texte}
                  </blockquote>
                ))}
                {[...day.points.values()].map((entry) => (
                  <StoredPointDay key={entry.point.id} entry={entry} date={day.date} />
                ))}
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
