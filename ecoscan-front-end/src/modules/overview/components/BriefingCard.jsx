import React from 'react'
import { BigNumber, DotBars, EcoMark, GlassCard } from '@/components/instruments'

export function BriefingCard({
  title = 'Bienvenue sur EcoScan.',
  description = 'Importez une facture ou saisissez un relevé pour recevoir votre premier briefing.',
  savedEnergy = '0',
  savedEnergyUnit = 'kWh',
  co2Saved = '0',
  co2Unit = 't',
  badgeText = '',
  trend = [],
  error,
  dailyRecap,
}) {
  return (
    <GlassCard as="article" tone="inverse" className="brief">
      <div className="brief-head">
        <EcoMark size={18} />
        <span>Briefing du jour</span>
        {badgeText && <span className="chip chip-lime">{badgeText}</span>}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {error && <span className="brief-note">{error}</span>}
      {dailyRecap && (
        <section className="brief-yesterday" aria-label={`Bilan du ${dailyRecap.dateLabel}`}>
          <div className="brief-yesterday-head">
            <strong>Bilan d’hier</strong>
            <span>{dailyRecap.dateLabel}</span>
          </div>
          {dailyRecap.observations.map((observation, index) => (
            <p className="brief-yesterday-observation" key={`${index}-${observation}`}>
              {observation}
            </p>
          ))}
          {dailyRecap.points.map((point) => (
            <div className="brief-yesterday-peak" key={point.point}>
              <strong>{point.mode === 'SOLDE_WOYOFAL' ? 'Woyofal · solde restant' : 'SENELEC · index cumulatif'} · {point.point}</strong>
              <div className="brief-yesterday-readings">
                {point.readings.map((reading) => (
                  <span key={reading.time}>
                    <b>{reading.time}</b> · {Number(reading.value).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh
                  </span>
                ))}
              </div>
              <p className="brief-yesterday-context">
                {point.mode === 'SOLDE_WOYOFAL'
                  ? `Les valeurs sont les soldes restants ; de ${point.openingBalance == null ? '—' : `${Number(point.openingBalance).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh à 08 h`} à ${point.closingBalance == null ? '—' : `${Number(point.closingBalance).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh à 20 h`}. Les recharges créditées sont prises en compte entre les relevés.`
                  : 'Les valeurs sont des index cumulatifs ; la consommation est calculée entre deux relevés.'}
              </p>
              <p className="brief-yesterday-total">
                Consommation mesurée de 08 h à 20 h :{' '}
                {point.dailySummary?.complete
                  ? `${Number(point.dailySummary.total).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh`
                  : `total indisponible (${point.dailySummary?.measuredCount || 0}/${point.dailySummary?.intervalCount || 0} périodes calculables)`}
                {point.dailySummary?.peak && (
                  <>
                    {' · '}Pic observé : {point.dailySummary.peak.startTime}–{point.dailySummary.peak.endTime}
                    {' '}({Number(point.dailySummary.peak.value).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh)
                  </>
                )}
              </p>
              {point.intervals.map((interval) => (
                <p key={`${interval.startTime}-${interval.endTime}`}>
                  {interval.startTime}–{interval.endTime}: {interval.value == null
                    ? 'consommation non calculable (relevé manquant ou incohérent)'
                    : `${Number(interval.value).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh consommés`}
                  {interval.changeFromPrevious != null && interval.changeFromPrevious > 0
                    ? `, soit +${Number(interval.changeFromPrevious).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh par rapport au créneau précédent`
                    : ''}
                  {interval.rechargeCredits > 0
                    ? ` · ${Number(interval.rechargeCredits).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kWh rechargés inclus`
                    : ''}
                </p>
              ))}
              {point.readings.filter((reading) => reading.note).map((reading) => (
                <p className="brief-yesterday-context" key={`${reading.time}-${reading.note}`}>
                  Note à {reading.time} : {reading.note}
                </p>
              ))}
              {!point.readings.some((reading) => reading.note) && (
                <p className="brief-yesterday-context">
                  Aucune note n’a été saisie : les relevés indiquent les valeurs et consommations, sans établir leur cause.
                </p>
              )}
            </div>
          ))}
        </section>
      )}
      <div className="brief-foot">
        <div>
          <span className="metric-label">Énergie économisée</span>
          <BigNumber value={savedEnergy} unit={savedEnergyUnit} />
        </div>
        <div>
          <span className="metric-label">Équivalent CO₂</span>
          <BigNumber value={co2Saved} unit={co2Unit} />
        </div>
        {trend.length > 0 && <DotBars values={trend} label="Tendance récente" />}
      </div>
    </GlassCard>
  )
}
