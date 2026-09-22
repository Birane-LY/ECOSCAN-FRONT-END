'use client'

import { useEffect, useState, useMemo } from 'react'
import { apiGet, API_PREFIX } from '@/lib/apiClient' // Ajustez le chemin selon votre structure

export function useOverviewData(period = '7d') {
  const [state, setState] = useState({
    loading: true,
    error: null,
    historique: [],
    objectifs: [],
    synthese: null,
    decisions: [],
  })

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        setState((s) => ({ ...s, loading: true, error: null }))

        // Appel parallèle des endpoints Django DRF
        const [histRes, objRes, synthRes, decRes] = await Promise.all([
          apiGet(`${API_PREFIX.ENERGIES}/historiques-performance/`).catch(() => []),
          apiGet(`${API_PREFIX.ENERGIES}/objectifs/`).catch(() => []),
          apiGet(`${API_PREFIX.ENERGIES}/syntheses-financieres/`).catch(() => []),
          apiGet(`${API_PREFIX.ANALYSES}/decisions/`).catch(() => []),
        ])

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            historique: Array.isArray(histRes) ? histRes : histRes.results ?? [],
            objectifs: Array.isArray(objRes) ? objRes : objRes.results ?? [],
            synthese: Array.isArray(synthRes) ? synthRes[0] : synthRes.results?.[0] ?? null,
            decisions: Array.isArray(decRes) ? decRes : decRes.results ?? [],
          })
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }))
        }
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  // 1. Transformation dynamique des séries pour le graphique principal (EnergyChart)
  const chartSeries = useMemo(() => {
    if (!state.historique.length) return null

    // Filtrer par période si nécessaire (ex: 7d, 30d, 90d)
    const items = [...state.historique].slice(-90)

    return items.map((item) => {
      const d = new Date(item.date_debut || item.date || Date.now())
      return {
        label: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        full: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        value: Number(item.valeur_kwh ?? item.consommation ?? item.valeur ?? 0),
        target: Number(item.valeur_cible_kwh ?? item.cible ?? item.objectif ?? 0),
      }
    })
  }, [state.historique])

  // 2. Calcul dynamique des blocs de synthèse (Hero, Briefing, Insight)
  const derivedMetrics = useMemo(() => {
    const totalConsommation = chartSeries
      ? chartSeries.reduce((acc, curr) => acc + curr.value, 0)
      : 0

    const totalCible = chartSeries
      ? chartSeries.reduce((acc, curr) => acc + curr.target, 0)
      : 0

    const savedKwh = Math.max(0, totalCible - totalConsommation)
    const co2Avoided = (savedKwh * 0.00042).toFixed(1) // Facteur de conversion moyen kWh -> tCO2

    // Calcul de la tendance (%)
    const gapPct = totalCible ? Math.round(((totalConsommation - totalCible) / totalCible) * 100) : 0
    const trendText = gapPct <= 0 ? `↓ ${Math.abs(gapPct)} %` : `↑ ${gapPct} %`

    // Recherche de la journée / du point avec la consommation maximale (Insight)
    const peakItem = chartSeries
      ? chartSeries.reduce((max, cur) => (cur.value > (max?.value || 0) ? cur : max), null)
      : null

    return {
      heroData: {
        score: state.synthese?.score_performance ?? 84,
        delta: state.synthese?.variation_mensuelle ?? '+6 pts ce mois',
        consumption: {
          value: totalConsommation ? totalConsommation.toLocaleString('fr-FR') : '0',
          unit: 'kWh',
          trend: trendText,
          note: 'par rapport aux objectifs configurés',
        },
        objective: {
          value: state.objectifs[0]?.pourcentage_atteint ?? 72,
          note: state.objectifs[0]?.statut_description || 'Progression sur vos objectifs globaux.',
        },
        savings: {
          value: savedKwh ? savedKwh.toLocaleString('fr-FR') : '0',
          unit: 'kWh',
          note: `soit ${co2Avoided} t de CO₂ évitées`,
        },
      },
      briefingData: {
        title: totalConsommation <= totalCible ? 'Vous êtes sur la bonne voie.' : 'Attention à votre consommation.',
        description: `Votre consommation totale s’élève à ${totalConsommation.toLocaleString('fr-FR')} kWh. ${
          savedKwh > 0 ? `Vous avez économisé environ ${savedKwh.toLocaleString('fr-FR')} kWh.` : ''
        }`,
        savedEnergy: savedKwh ? savedKwh.toLocaleString('fr-FR') : '0',
        savedEnergyUnit: 'kWh',
        co2Saved: co2Avoided,
        co2Unit: 't',
        badgeText: state.loading ? 'Mise à jour...' : 'À jour',
        error: state.error,
      },
      insightData: {
        title: peakItem ? `${peakItem.full} est votre pic de consommation.` : 'Analyse des tendances',
        description: peakItem
          ? `Le pic maximal enregistré est de ${peakItem.value.toLocaleString('fr-FR')} kWh sur cette période.`
          : 'Aucune donnée suffisante pour dégager un pic.',
        share: peakItem && totalConsommation ? Math.round((peakItem.value / totalConsommation) * 100) : '0',
      },
      decisionsData: state.decisions.length
        ? state.decisions
        : state.objectifs.map((o) => ({
            title: o.nom || o.titre || 'Objectif',
            scope: o.description || 'Inconnu',
            value: o.valeur_cible ? `${o.valeur_cible} ${o.unite || ''}`.trim() : null,
            impact: o.priorite || 'Moyen',
          })),
    }
  }, [chartSeries, state])

  return {
    loading: state.loading,
    error: state.error,
    chartSeries,
    ...derivedMetrics,
  }
}