"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { apiGet, apiPost } from "@/lib/apiClient"
import { getPreviousDateString } from "@/modules/business-tools/services/woyofalCalculations"

function asList(response, resource) {
  const items = Array.isArray(response) ? response : response?.results
  if (!Array.isArray(items)) throw new Error(`Réponse inattendue du serveur pour ${resource}.`)
  return items
}

export function useEnergyRitual(date) {
  const [sites, setSites] = useState([])
  const [compteurs, setCompteurs] = useState([])
  const [points, setPoints] = useState([])
  const [selectedPointId, setSelectedPointId] = useState("")
  const [readings, setReadings] = useState([])
  const [previousReadings, setPreviousReadings] = useState([])
  const [recharges, setRecharges] = useState([])
  const [loading, setLoading] = useState(true)
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [error, setError] = useState(null)
  const recordsRequestId = useRef(0)

  const selectedPoint = useMemo(
    () => points.find((point) => point.id === selectedPointId) || points[0] || null,
    [points, selectedPointId],
  )

  const loadSetup = useCallback(async () => {
    try {
      const [siteResponse, meterResponse, pointResponse] = await Promise.all([
        apiGet("/organisations/sites/"),
        apiGet("/organisations/compteurs/"),
        apiGet("/energies/points-suivi-energetique/"),
      ])
      const loadedSites = asList(siteResponse, "les sites")
      const loadedMeters = asList(meterResponse, "les compteurs")
      const loadedPoints = asList(pointResponse, "les points de suivi")
      setSites(loadedSites)
      setCompteurs(loadedMeters)
      setPoints(loadedPoints)
      setSelectedPointId((currentId) =>
        loadedPoints.some((point) => point.id === currentId)
          ? currentId
          : loadedPoints[0]?.id || "",
      )
    } catch (loadError) {
      setError(loadError.message || "Impossible de charger les points de suivi.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadSetup() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadSetup])

  const refreshRecords = useCallback(async () => {
    if (!selectedPoint) return
    const requestId = recordsRequestId.current + 1
    recordsRequestId.current = requestId
    await Promise.resolve()
    if (recordsRequestId.current !== requestId) return
    setRecordsLoading(true)
    const previousDateString = getPreviousDateString(date)

    try {
      const pointFilter = `point_suivi=${encodeURIComponent(selectedPoint.id)}`
      const [todayResponse, previousResponse, rechargeResponse] = await Promise.all([
        apiGet(`/energies/releves-rituel/?${pointFilter}&date_releve=${date}`),
        apiGet(`/energies/releves-rituel/?${pointFilter}&date_releve=${previousDateString}`),
        apiGet(`/energies/recharges-rituel-woyofal/?${pointFilter}&date_from=${previousDateString}&date_to=${date}`),
      ])
      if (recordsRequestId.current !== requestId) return
      setReadings(asList(todayResponse, "les relevés du jour"))
      setPreviousReadings(asList(previousResponse, "les relevés précédents"))
      setRecharges(asList(rechargeResponse, "les recharges"))
      setError(null)
    } catch (loadError) {
      if (recordsRequestId.current === requestId) {
        setError(loadError.message || "Impossible de charger les relevés.")
      }
    } finally {
      if (recordsRequestId.current === requestId) setRecordsLoading(false)
    }
  }, [date, selectedPoint])

  useEffect(() => {
    const timer = window.setTimeout(() => { void refreshRecords() }, 0)
    return () => window.clearTimeout(timer)
  }, [refreshRecords])

  const createPoint = useCallback(async (payload) => {
    setError(null)
    const point = await apiPost("/energies/points-suivi-energetique/", payload)
    setPoints((current) => [...current, point])
    setSelectedPointId(point.id)
    return point
  }, [])

  const saveReading = useCallback(async ({ creneau, valeur_kwh, note }) => {
    if (!selectedPoint) throw new Error("Sélectionnez un point de suivi.")
    const reading = await apiPost("/energies/releves-rituel/", {
      point_suivi: selectedPoint.id,
      date_releve: date,
      creneau,
      valeur_kwh,
      note,
    })
    setReadings((current) => [...current, reading])
    return reading
  }, [date, selectedPoint])

  const saveRecharge = useCallback(async ({ montant_fcfa, kwh_credites, note, effectuee_le }) => {
    if (!selectedPoint) throw new Error("Sélectionnez un point de suivi.")
    const recharge = await apiPost("/energies/recharges-rituel-woyofal/", {
      point_suivi: selectedPoint.id,
      montant_fcfa,
      kwh_credites,
      note,
      ...(effectuee_le ? { effectuee_le } : {}),
    })
    setRecharges((current) => [recharge, ...current])
    return recharge
  }, [selectedPoint])

  return {
    sites,
    compteurs,
    points,
    selectedPoint,
    selectedPointId,
    setSelectedPointId,
    readings,
    previousReadings,
    recharges,
    loading,
    recordsLoading,
    error,
    refreshRecords,
    createPoint,
    saveReading,
    saveRecharge,
  }
}
