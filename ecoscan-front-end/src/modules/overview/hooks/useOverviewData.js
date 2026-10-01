'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet, apiGetAll, API_PREFIX } from '@/lib/apiClient'
import {
  getDailyIntervals,
  getLocalDateString,
  getPreviousDateString,
  summarizeDailyConsumption,
} from '@/modules/business-tools/services/woyofalCalculations'

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])
const JOURS = { '7d': 7, '30d': 30, '90d': 90 }
// Repli si aucun FacteurEmission « électricité » exploitable n'est configuré (t CO₂ / kWh).
const FACTEUR_REPLI_TCO2_PAR_KWH = 0.00042
const nombre = (v) => Number(v) || 0
const PRIORITES = { BASSE: 'Basse', MOYENNE: 'Moyenne', HAUTE: 'Haute', CRITIQUE: 'Critique' }
const fmt = (n) => Math.round(n || 0).toLocaleString('fr-FR')
const dateDuJour = () => getLocalDateString()

const pctObjectif = (o) =>
  o?.valeur_cible ? Math.min(100, Math.round((nombre(o.progression_actuelle) / nombre(o.valeur_cible)) * 100)) : 0

/** Facteur d'émission de l'électricité en t CO₂ / kWh d'après /energies/facteurs-emission/, ou null. */
function facteurTco2ParKwh(facteurs) {
  const f = [...facteurs]
    .filter((x) => /lect/i.test(x.type_energie || ''))
    .sort((a, b) => new Date(b.version) - new Date(a.version))[0]
  if (!f) return null
  const unite = String(f.unite || '').toLowerCase().replace(/\s/g, '')
  const v = Number(f.valeur)
  if (!Number.isFinite(v)) return null
  if (unite.startsWith('kg')) return v / 1000
  if (unite.startsWith('tco2') || unite.startsWith('t/') || unite.startsWith('tonne')) return v
  if (unite.startsWith('g')) return v / 1e6
  return null
}

/**
 * Données du tableau de bord — 100 % issues de l'API, sans valeur de démonstration.
 * Champs réels : HistoriquePerformance = periode, consommation, emissions, economie, unite
 * (l'ancien code lisait date_debut/valeur_kwh/valeur_cible, qui n'existent pas : tous les
 * points tombaient à « aujourd'hui »).
 */
export function useOverviewData(period = '7d', { enabled = true, scopeKey = '' } = {}) {
  const [tick, setTick] = useState(0)
  const yesterday = getPreviousDateString(dateDuJour())
  const [state, setState] = useState({
    loading: false, ready: false, error: null,
    historique: [], resultats: [], objectifs: [], progressions: [], recommandations: [], hypotheses: [], anomalies: [], facteurs: [],
    observations: [], pointsSuivi: [], relevesRituel: [], rechargesRituel: [],
  })

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    if (!enabled) return undefined

    async function load() {
      setState({
        loading: true, ready: false, error: null,
        historique: [], resultats: [], objectifs: [], progressions: [], recommandations: [], hypotheses: [], anomalies: [], facteurs: [],
        observations: [], pointsSuivi: [], relevesRituel: [], rechargesRituel: [],
      })
      const echecs = []
      const safe = (source, promise) => promise
        .then(unwrap)
        .catch(() => { echecs.push(source); return [] })
      const safeAll = (source, promise) => promise
        .catch(() => { echecs.push(source); return [] })

      const [historique, resultats, objectifs, progressions, recommandations, hypotheses, anomalies, facteurs,
        observations, pointsSuivi, relevesRituel, rechargesRituel] = await Promise.all([
        safe('historiques-performance', apiGet(`${API_PREFIX.ENERGIES}/historiques-performance/`)),
        safe('resultats-metriques', apiGet(`${API_PREFIX.ANALYSES}/resultats-metriques/`)),
        safe('objectifs', apiGet(`${API_PREFIX.ENERGIES}/objectifs/`)),
        safe('progression-objectifs', apiGet(`${API_PREFIX.ANALYSES}/progression-objectifs/`)),
        safe('recommandations', apiGet(`${API_PREFIX.ANALYSES}/recommandations/`)),
        safe('hypotheses', apiGet(`${API_PREFIX.ANALYSES}/hypotheses/`)),
        safe('anomalies', apiGet(`${API_PREFIX.ANALYSES}/anomalies/`)),
        safe('facteurs-emission', apiGet(`${API_PREFIX.ENERGIES}/facteurs-emission/`)),
        safeAll('observations', apiGetAll(`${API_PREFIX.ANALYSES}/observations/`)),
        safeAll('points-suivi-energetique', apiGetAll(`${API_PREFIX.ENERGIES}/points-suivi-energetique/`)),
        safeAll('releves-rituel', apiGetAll(`${API_PREFIX.ENERGIES}/releves-rituel/?date_releve=${yesterday}`)),
        safeAll('recharges-rituel-woyofal', apiGetAll(`${API_PREFIX.ENERGIES}/recharges-rituel-woyofal/?date_from=${yesterday}&date_to=${yesterday}`)),
      ])
      if (cancelled) return
      setState({
        loading: false, ready: true,
        error: echecs.length === 12
          ? 'Impossible de charger les données de la vue d’ensemble.'
          : echecs.length
            ? `Certaines données n’ont pas pu être chargées (${echecs.join(', ')}).`
            : null,
        historique, resultats, objectifs, progressions, recommandations, hypotheses, anomalies, facteurs,
        observations, pointsSuivi, relevesRituel, rechargesRituel,
      })
    }
    load()
    return () => { cancelled = true }
  }, [enabled, scopeKey, tick, yesterday])

  // Série du graphique : historique de performance si disponible, sinon les factures
  // importées (données réelles tant qu'aucune consolidation périodique n'existe).
  const chartSeries = useMemo(() => {
    let points = []
    if (state.historique.length) {
      points = [...state.historique]
        .filter((h) => h.periode)
        .sort((a, b) => new Date(a.periode) - new Date(b.periode)) // l'API renvoie du plus récent au plus ancien
        .map((h) => {
          const d = new Date(h.periode)
          return {
            label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            full: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
            value: nombre(h.consommation),
            target: 0,
            economie: nombre(h.economie),
          }
        })
    } else {
      points = state.resultats
        .filter((r) => r.code_metrique === 'consommation_facture_periodique' && r.valeur != null && r.periode_fin)
        .sort((a, b) => new Date(a.periode_fin) - new Date(b.periode_fin))
        .map((r) => {
          const d = new Date(r.periode_fin)
          return {
            label: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
            full: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            value: nombre(r.valeur),
            target: 0,
            economie: 0,
          }
        })
    }
    return points.length ? points.slice(-(JOURS[period] || 7)) : null
  }, [state.historique, state.resultats, period])

  const derived = useMemo(() => {
    const serie = chartSeries || []
    const total = serie.reduce((a, p) => a + p.value, 0)
    const totalCible = serie.reduce((a, p) => a + p.target, 0)
    const economieHistorique = serie.reduce((a, p) => a + (p.economie || 0), 0)

    const actifs = state.objectifs.filter((o) => ['ACTIF', 'ATTEINT'].includes(String(o.statut).toUpperCase()))
    const brouillons = state.objectifs.filter((o) => o.statut === 'BROUILLON')
    const progressionsParObjectif = new Map(state.progressions.map((progression) => [String(progression.objectif_id), progression]))
    const progressionObjectifs = actifs.map((objectif) => {
      const progression = progressionsParObjectif.get(String(objectif.id))
      const mesureReelleDisponible = progression?.mesuree != null && progression?.fiabilite !== 'initiale'
      return {
        id: objectif.id,
        title: objectif.nom || 'Objectif énergétique',
        measured: mesureReelleDisponible
          ? `${Number(progression.mesuree).toLocaleString('fr-FR')} ${objectif.unite || ''}`.trim()
          : null,
        detail: progression?.detail || progression?.raison || 'Mesure réelle non disponible.',
        source: progression?.source,
      }
    })
    const pctGlobal = actifs.length ? Math.round(actifs.reduce((s, o) => s + pctObjectif(o), 0) / actifs.length) : 0

    // Économie : consolidée dans l'historique (champ « economie »), sinon écart à la cible,
    // sinon progression déclarée des objectifs exprimés en kWh
    const savedKwh = economieHistorique > 0
      ? economieHistorique
      : totalCible > 0
        ? Math.max(0, totalCible - total)
        : actifs.filter((o) => o.unite === 'kWh').reduce((s, o) => s + nombre(o.progression_actuelle), 0)

    const facteur = facteurTco2ParKwh(state.facteurs)
    const co2 = (savedKwh * (facteur ?? FACTEUR_REPLI_TCO2_PAR_KWH)).toFixed(1).replace('.', ',')
    const noteCo2 = `soit ${co2} t de CO₂ évitées${facteur == null ? ' (estimation : aucun facteur d’émission configuré)' : ''}`

    let trend = '—'
    if (totalCible > 0) {
      const gap = Math.round(((total - totalCible) / totalCible) * 100)
      trend = gap <= 0 ? `↓ ${Math.abs(gap)} %` : `↑ ${gap} %`
    } else if (serie.length >= 2 && serie[serie.length - 2].value > 0) {
      const prev = serie[serie.length - 2].value
      const gap = Math.round(((serie[serie.length - 1].value - prev) / prev) * 100)
      trend = gap <= 0 ? `↓ ${Math.abs(gap)} %` : `↑ ${gap} %`
    }

    const pic = serie.reduce((max, p) => (p.value > (max?.value || 0) ? p : max), null)
    const anomalie = state.anomalies[0] || null
    const pointsWoyofal = state.pointsSuivi.filter(
      (point) => String(point.organisation) === String(scopeKey)
        && point.mode_mesure === 'SOLDE_WOYOFAL',
    )
    const metriquesWoyofal = state.resultats
      .filter((resultat) => String(resultat.organisation) === String(scopeKey)
        && resultat.code_metrique === 'variation_woyofal_rituelle_vs_moyenne_recente')
      .sort((a, b) => new Date(b.periode_fin || 0) - new Date(a.periode_fin || 0))
    const derniereMetriqueWoyofal = metriquesWoyofal[0]
    const anomalieWoyofal = derniereMetriqueWoyofal
      ? state.anomalies.find((item) => String(item.resultat_metrique) === String(derniereMetriqueWoyofal.id))
      : null
    const recommandationWoyofal = anomalieWoyofal
      ? state.recommandations.find((item) => String(item.anomalie) === String(anomalieWoyofal.id))
      : null
    const statutAnalyseWoyofal = pointsWoyofal.length
      ? anomalieWoyofal
        ? `Anomalie Woyofal ${anomalieWoyofal.statut === 'ACTION_CREATED' ? 'avec une recommandation' : 'à examiner'} : les relevés comparés couvrent uniquement 08 h–20 h.${recommandationWoyofal ? ` Recommandation : ${recommandationWoyofal.statut.toLowerCase()}.` : ''}`
        : derniereMetriqueWoyofal
          ? 'Analyse Woyofal effectuée : aucune variation dépassant le seuil de surveillance sur la fenêtre mesurée 08 h–20 h.'
          : 'Analyse comparative Woyofal en attente : il faut au moins 4 journées complètes parmi les 7 précédentes pour établir une référence 08 h–20 h.'
      : null
    const hypothesesEnAttente = state.hypotheses.filter((h) => h.statut === 'PROPOSEE')
    const observationsHier = state.observations
      .filter((observation) => String(observation.organisation) === String(scopeKey))
      .filter((observation) => {
        const date = new Date(observation.date_observation)
        return !Number.isNaN(date.getTime()) && getLocalDateString(date) === yesterday
      })
      .sort((a, b) => new Date(a.date_observation) - new Date(b.date_observation))
    const pointsOrganisation = state.pointsSuivi.filter(
      (point) => String(point.organisation) === String(scopeKey),
    )
    const pointsDuJour = pointsOrganisation.flatMap((point) => {
      const readings = state.relevesRituel.filter(
        (reading) => String(reading.point_suivi) === String(point.id),
      ).sort((a, b) => a.creneau.localeCompare(b.creneau))
      if (!readings.length) return []
      const recharges = state.rechargesRituel.filter(
        (recharge) => String(recharge.point_suivi) === String(point.id),
      )
      const intervals = getDailyIntervals({
        readings,
        mode: point.mode_mesure,
        recharges,
        date: yesterday,
      })
      const dailySummary = summarizeDailyConsumption(intervals)
      return [{
        point: point.nom,
        mode: point.mode_mesure,
        dailySummary,
        openingBalance: readings.find((reading) => reading.creneau === '08:00')?.valeur_kwh ?? null,
        closingBalance: readings.find((reading) => reading.creneau === '20:00')?.valeur_kwh ?? null,
        readings: readings.map((reading) => ({
          time: reading.creneau,
          value: reading.valeur_kwh,
          note: reading.note?.trim() || '',
        })),
        intervals: intervals.map((interval, index) => {
          const readingAtEnd = readings.find((reading) => reading.creneau === interval.endTime)
          const intervalPrecedent = intervals[index - 1]
          const rechargeCredits = recharges.reduce((totalCredits, recharge) => {
            const rechargeDate = new Date(recharge.effectuee_le)
            if (Number.isNaN(rechargeDate.getTime()) || getLocalDateString(rechargeDate) !== yesterday) {
              return totalCredits
            }
            const time = `${String(rechargeDate.getHours()).padStart(2, '0')}:${String(rechargeDate.getMinutes()).padStart(2, '0')}`
            return time > interval.startTime && time <= interval.endTime
              ? totalCredits + nombre(recharge.kwh_credites)
              : totalCredits
          }, 0)

          return {
            startTime: interval.startTime,
            endTime: interval.endTime,
            value: interval.value,
            changeFromPrevious: interval.value != null && intervalPrecedent?.value != null
              ? interval.value - intervalPrecedent.value
              : null,
            note: readingAtEnd?.note?.trim() || '',
            rechargeCredits,
          }
        }),
      }]
    })
    const yesterdayLabel = new Date(`${yesterday}T12:00:00`).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    })
    const dailyRecap = observationsHier.length || pointsDuJour.length
      ? {
          dateLabel: yesterdayLabel,
          observations: observationsHier.map((observation) => observation.texte).filter(Boolean),
          points: pointsDuJour,
        }
      : null

    const maxSerie = Math.max(1, ...serie.map((p) => p.value))
    const tendanceBarres = serie.slice(-7).map((p) => Math.max(1, Math.round((p.value / maxSerie) * 8)))

    let titreBriefing = 'Bienvenue sur EcoScan.'
    if (anomalie) titreBriefing = `${state.anomalies.length} anomalie${state.anomalies.length > 1 ? 's' : ''} à examiner.`
    else if (serie.length) titreBriefing = 'Aucune anomalie détectée.'

    const descriptionBriefing = (serie.length
      ? `Votre consommation sur la période s’élève à ${fmt(total)} kWh${trend !== '—' ? ` (${trend} par rapport au point précédent)` : ''}.` +
        (hypothesesEnAttente.length ? ` ${hypothesesEnAttente.length} hypothèse${hypothesesEnAttente.length > 1 ? 's' : ''} IA attend${hypothesesEnAttente.length > 1 ? 'ent' : ''} votre validation.` : '')
      : 'Importez une facture ou saisissez un relevé pour recevoir votre premier briefing.') +
      (statutAnalyseWoyofal ? ` ${statutAnalyseWoyofal}` : '')

    const decisionsData = [
      ...state.recommandations.filter((r) => r.statut !== 'DECIDEE').map((r) => ({
        title: r.titre,
        scope: r.description,
        value: Number(r.economie_estimee) > 0
          ? `${Number(r.economie_estimee).toLocaleString('fr-FR')} ${r.unite || ''}`.trim()
          : null,
        impact: PRIORITES[r.priorite] || undefined,
      })),
      ...hypothesesEnAttente.map((h) => ({
        title: 'Valider un diagnostic',
        scope: (h.texte || '').slice(0, 120),
        impact: 'À valider',
      })),
      ...brouillons.map((o) => ({
        title: `Activer l’objectif : ${o.nom || 'Objectif'}`,
        scope: o.description || 'Objectif en brouillon',
        value: o.valeur_cible ? `${Number(o.valeur_cible).toLocaleString('fr-FR')} ${o.unite || ''}`.trim() : null,
        impact: 'Brouillon',
      })),
    ]

    return {
      heroData: {
        score: pctGlobal,
        delta: undefined,
        consumption: {
          value: fmt(total), unit: 'kWh', trend,
          note: serie.length ? 'calculé sur vos données enregistrées' : 'aucune donnée enregistrée',
        },
        objective: {
          value: pctGlobal,
          note: actifs.length
            ? `${actifs.length} objectif${actifs.length > 1 ? 's' : ''} actif${actifs.length > 1 ? 's' : ''}`
            : brouillons.length ? 'Aucun objectif actif : activez vos brouillons.' : 'Aucun objectif défini.',
        },
        savings: { value: fmt(savedKwh), unit: 'kWh', note: noteCo2 },
      },
      briefingData: {
        title: titreBriefing,
        description: descriptionBriefing,
        dailyRecap,
        savedEnergy: fmt(savedKwh), savedEnergyUnit: 'kWh',
        co2Saved: co2, co2Unit: 't',
        badgeText: state.loading ? 'Mise à jour…' : 'À jour',
        trend: tendanceBarres,
        error: state.error,
      },
      insightData: anomalie
        ? {
            title: anomalie.type === 'consumption_drop' ? 'Baisse de consommation détectée.' : 'Hausse de consommation détectée.',
            description: `Écart de ${Number(anomalie.ecart_pourcentage).toLocaleString('fr-FR')} % par rapport à la référence` +
              (hypothesesEnAttente.length ? '. Une diagnostic(s) attend votre validation.' : '.'),
            buttonText: 'Demander à l’assistant',
            share: String(Math.abs(Math.round(Number(anomalie.ecart_pourcentage)))),
            barsData: serie.slice(-7),
          }
        : {
            title: pic ? `${pic.full} est votre pic de consommation.` : 'Analyse des tendances',
            description: pic
              ? `Le pic maximal enregistré est de ${fmt(pic.value)} kWh sur cette période.`
              : 'Aucune donnée suffisante pour dégager un pic.',
            share: pic && total ? String(Math.round((pic.value / total) * 100)) : '0',
            barsData: serie.slice(-7),
          },
      decisionsData,
      progressionObjectifs,
      assistantData: {
        message: anomalie ? 'Une anomalie mérite votre attention.' : 'Posez une question sur vos données.',
        suggestions: ['Où est mon plus gros levier ?', 'Y a-t-il des anomalies à traiter ?'],
      },
    }
  }, [chartSeries, scopeKey, state, yesterday])

  return {
    loading: state.loading && !state.ready,
    error: state.error,
    chartSeries,
    reload,
    ...derived,
  }
}
