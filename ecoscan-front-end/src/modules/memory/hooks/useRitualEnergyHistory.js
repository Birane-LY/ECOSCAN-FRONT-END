'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiGetAll } from '@/lib/apiClient'
import { getLocalDateString } from '@/modules/business-tools/services/woyofalCalculations'

const asDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : getLocalDateString(date)
}

export function useRitualEnergyHistory(organisationId) {
  const [state, setState] = useState({ loading: false, error: null, days: [], points: [] })

  const reload = useCallback(async () => {
    if (!organisationId) {
      setState({ loading: false, error: null, days: [], points: [] })
      return
    }

    setState((current) => ({ ...current, loading: true, error: null }))
    try {
      const [allPoints, allReadings, allRecharges, allObservations] = await Promise.all([
        apiGetAll('/energies/points-suivi-energetique/'),
        apiGetAll('/energies/releves-rituel/'),
        apiGetAll('/energies/recharges-rituel-woyofal/'),
        apiGetAll('/analyses/observations/'),
      ])
      const points = allPoints.filter((point) => String(point.organisation) === String(organisationId))
      const pointById = new Map(points.map((point) => [String(point.id), point]))
      const daysByDate = new Map()
      const getDay = (date) => {
        if (!daysByDate.has(date)) daysByDate.set(date, { date, observations: [], points: new Map() })
        return daysByDate.get(date)
      }
      const getPointDay = (day, point) => {
        const key = String(point.id)
        if (!day.points.has(key)) day.points.set(key, { point, readings: [], recharges: [] })
        return day.points.get(key)
      }

      allReadings.forEach((reading) => {
        const point = pointById.get(String(reading.point_suivi))
        if (!point || !reading.date_releve) return
        getPointDay(getDay(reading.date_releve), point).readings.push(reading)
      })
      allRecharges.forEach((recharge) => {
        const point = pointById.get(String(recharge.point_suivi))
        const date = asDate(recharge.effectuee_le)
        if (!point || !date) return
        getPointDay(getDay(date), point).recharges.push(recharge)
      })
      allObservations.forEach((observation) => {
        const date = asDate(observation.date_observation)
        if (String(observation.organisation) === String(organisationId) && date) {
          getDay(date).observations.push(observation)
        }
      })

      const days = [...daysByDate.values()]
        .sort((left, right) => right.date.localeCompare(left.date))
        .map((day) => ({
          ...day,
          observations: day.observations.sort(
            (left, right) => new Date(left.date_observation) - new Date(right.date_observation),
          ),
          points: [...day.points.values()]
            .map(({ point, readings, recharges }) => ({
              point,
              readings: readings.sort((left, right) => left.creneau.localeCompare(right.creneau)),
              recharges: recharges.sort(
                (left, right) => new Date(left.effectuee_le) - new Date(right.effectuee_le),
              ),
            }))
            .sort((left, right) => left.point.nom.localeCompare(right.point.nom, 'fr')),
        }))

      setState({ loading: false, error: null, days, points })
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error.message || 'Impossible de charger le journal énergétique conservé.',
      }))
    }
  }, [organisationId])

  useEffect(() => { void reload() }, [reload])

  return { ...state, reload }
}
