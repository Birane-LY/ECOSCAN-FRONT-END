"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, FileText, Mic, Plus, Save, Zap } from "lucide-react"
import { GlassCard } from "@/components/instruments"
import { apiUpload } from "@/lib/apiClient"
import { useOrganisation } from "@/modules/business-tools/hooks/useOrganisation"
import { useEnergyRitual } from "@/modules/business-tools/hooks/useEnergyRitual"
import { useDailyObservation } from "@/modules/business-tools/hooks/useDailyObservation"
import {
  getDailyIntervals,
  getLocalDateString,
  getPreviousDateString,
  getRitualSlotStatus,
  isDailyReviewAvailable,
  RITUAL_SLOTS,
  summarizeDailyConsumption,
} from "@/modules/business-tools/services/woyofalCalculations"

const MODES = {
  INDEX_CUMULATIF: "SENELEC · index cumulatif",
  SOLDE_WOYOFAL: "Woyofal · solde en kWh",
}

function formatKwh(value) {
  return value == null
    ? "—"
    : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} kWh`
}

export function EnergyRitualTool({ setDrawer, pendingCapture, onCaptureConsumed }) {
  const [date, setDate] = useState(getLocalDateString)
  const [pointName, setPointName] = useState("")
  const [siteId, setSiteId] = useState("")
  const [meterId, setMeterId] = useState("")
  const [mode, setMode] = useState("INDEX_CUMULATIF")
  const [showCreatePoint, setShowCreatePoint] = useState(false)
  const [values, setValues] = useState({})
  const [notes, setNotes] = useState({})
  const [savingSlot, setSavingSlot] = useState("")
  const [savingRecharge, setSavingRecharge] = useState(false)
  const [error, setError] = useState(null)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [rechargeKwh, setRechargeKwh] = useState("")
  const [rechargeNote, setRechargeNote] = useState("")
  const [selectedRechargeDate, setSelectedRechargeDate] = useState(getLocalDateString)
  const [selectedRechargeTime, setSelectedRechargeTime] = useState(() => {
    const current = new Date()
    return `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`
  })
  const [now, setNow] = useState(new Date())
  const [dailyReview, setDailyReview] = useState("")
  const [reviewMode, setReviewMode] = useState("text")
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [voiceError, setVoiceError] = useState("")
  const [savingReview, setSavingReview] = useState(false)
  const [reviewSaved, setReviewSaved] = useState(false)
  const recorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingStartedAtRef = useRef(0)
  const reviewAvailable = isDailyReviewAvailable(date, now)
  const {
    organisation,
    loading: organisationLoading,
    error: organisationError,
  } = useOrganisation()
  const {
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
    error: loadError,
    createPoint,
    saveReading,
    saveRecharge,
  } = useEnergyRitual(date)
  const selectedSite = sites.find((site) => String(site.id) === String(selectedPoint?.site))
  const orgId = selectedPoint?.organisation || organisation?.id
  const { enregistrerBilan } = useDailyObservation(orgId, null, date)
  const previousDate = getPreviousDateString(date)
  const rechargeDate = selectedRechargeDate < previousDate || selectedRechargeDate > date
    ? date
    : selectedRechargeDate
  const todayIntervals = useMemo(() => getDailyIntervals({
    readings,
    mode: selectedPoint?.mode_mesure,
    recharges,
    date,
  }), [readings, selectedPoint?.mode_mesure, recharges, date])
  const previousIntervals = useMemo(() => getDailyIntervals({
    readings: previousReadings,
    mode: selectedPoint?.mode_mesure,
    recharges,
    date: previousDate,
  }), [previousReadings, selectedPoint?.mode_mesure, recharges, previousDate])
  const dailySummary = useMemo(
    () => summarizeDailyConsumption(todayIntervals),
    [todayIntervals],
  )
  const savedByTime = useMemo(
    () => new Map(readings.map((reading) => [reading.creneau, reading])),
    [readings],
  )
  const handledCapture = useRef(null)
  const previousByTime = useMemo(
    () => new Map(previousReadings.map((reading) => [reading.creneau, reading])),
    [previousReadings],
  )
  const availableSites = sites.filter((site) => String(site.organisation) === String(orgId))
  const siteMeters = compteurs.filter((meter) => String(meter.site) === String(siteId))

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => () => {
    if (recorderRef.current) {
      recorderRef.current.ondataavailable = null
      recorderRef.current.onstop = null
      recorderRef.current.onerror = null
      if (recorderRef.current.state === "recording") recorderRef.current.stop()
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  async function transcribeRecording(blob, mimeType) {
    if (!blob.size) {
      setVoiceError("Aucun son n’a été enregistré. Vérifiez le microphone puis réessayez.")
      return
    }

    const extension = mimeType.includes("webm") ? "webm"
      : mimeType.includes("ogg") ? "ogg"
        : mimeType.includes("wav") ? "wav"
          : "m4a"
    const formData = new FormData()
    formData.append("file", blob, `bilan-energie.${extension}`)
    formData.append("language", "fr")
    setIsTranscribing(true)
    setVoiceError("Transcription du bilan…")
    try {
      const result = await apiUpload("/energies/transcrire-audio/", formData)
      const transcript = result.transcription?.trim()
      if (!transcript) {
        setVoiceError("Aucune parole n’a été reconnue. Vous pouvez réenregistrer ou saisir le bilan par écrit.")
        return
      }
      setDailyReview((current) => `${current}${current ? " " : ""}${transcript}`)
      setVoiceError("Transcription terminée. Relisez le texte avant d’enregistrer le bilan.")
    } catch (transcriptionError) {
      setVoiceError(transcriptionError.message || "La transcription a échoué. Vous pouvez saisir le bilan par écrit.")
    } finally {
      setIsTranscribing(false)
    }
  }

  async function toggleVoiceCapture() {
    if (isRecording) {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop()
      return
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === "undefined") {
      setVoiceError("L’enregistrement vocal n’est pas disponible dans ce navigateur. Autorisez le microphone ou saisissez le bilan par écrit.")
      return
    }

    setVoiceError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const formats = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4"]
      const mimeType = formats.find((format) => MediaRecorder.isTypeSupported(format))
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      audioChunksRef.current = []
      mediaStreamRef.current = stream
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }
      recorder.onerror = () => {
        setVoiceError("L’enregistrement a été interrompu. Vérifiez le microphone puis réessayez.")
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
        mediaStreamRef.current = null
        recorderRef.current = null
      }
      recorder.onstop = () => {
        const recordingBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType })
        audioChunksRef.current = []
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
        mediaStreamRef.current = null
        recorderRef.current = null
        if (Date.now() - recordingStartedAtRef.current < 1500) {
          setVoiceError("L’enregistrement est trop court. Parlez pendant au moins deux secondes avant de l’arrêter.")
          return
        }
        void transcribeRecording(recordingBlob, recorder.mimeType)
      }
      recorder.start(250)
      recordingStartedAtRef.current = Date.now()
      setIsRecording(true)
    } catch (recordingError) {
      setVoiceError(recordingError.name === "NotAllowedError"
        ? "L’accès au microphone a été refusé. Autorisez-le dans les paramètres du navigateur puis réessayez."
        : recordingError.message || "Impossible de démarrer l’enregistrement vocal.")
    }
  }

  useEffect(() => {
    if (!pendingCapture || handledCapture.current === pendingCapture) return
    handledCapture.current = pendingCapture
    const capturedValue = pendingCapture.nouveau_index ?? pendingCapture.consommation_kwh
    const openSlot = RITUAL_SLOTS.find(({ time }, index) =>
      !savedByTime.has(time) &&
      !values[time] &&
      getRitualSlotStatus(index, date, now) === "OPEN"
    )
    const timer = window.setTimeout(() => {
      if (capturedValue != null && openSlot) {
        setValues((current) => ({ ...current, [openSlot.time]: String(capturedValue) }))
      } else if (capturedValue != null) {
        setError("Aucun créneau de relevé n’est ouvert pour cette capture.")
      }
      onCaptureConsumed?.()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [pendingCapture, onCaptureConsumed, savedByTime, values, date, now])

  async function handleCreatePoint(event) {
    event.preventDefault()
    if (!orgId) {
      setError("Votre organisation n’a pas pu être identifiée.")
      return
    }
    setError(null)
    try {
      await createPoint({
        organisation: orgId,
        site: siteId || null,
        compteur: meterId || null,
        nom: pointName.trim() || (mode === "SOLDE_WOYOFAL" ? "Suivi Woyofal" : "Suivi SENELEC"),
        mode_mesure: mode,
      })
      setPointName("")
      setMeterId("")
      setSiteId("")
      setValues({})
      setNotes({})
      setDailyReview("")
      setReviewSaved(false)
      setShowCreatePoint(false)
    } catch (createError) {
      setError(createError.message || "Le point de suivi n’a pas pu être créé.")
    }
  }

  async function handleSaveReading(time) {
    const rawValue = values[time]
    if (rawValue === "" || !Number.isFinite(Number(rawValue)) || Number(rawValue) < 0) {
      setError("Saisissez une valeur en kWh égale ou supérieure à zéro.")
      return
    }
    setSavingSlot(time)
    setError(null)
    try {
      await saveReading({ creneau: time, valeur_kwh: rawValue, note: (notes[time] || "").trim() })
      setValues((current) => ({ ...current, [time]: "" }))
      setNotes((current) => ({ ...current, [time]: "" }))
    } catch (saveError) {
      setError(saveError.message || "Le relevé n’a pas pu être enregistré.")
    } finally {
      setSavingSlot("")
    }
  }

  async function handleSaveRecharge(event) {
    event.preventDefault()
    setSavingRecharge(true)
    setError(null)
    try {
      await saveRecharge({
        montant_fcfa: rechargeAmount,
        kwh_credites: rechargeKwh,
        note: rechargeNote.trim(),
        effectuee_le: new Date(`${rechargeDate}T${selectedRechargeTime}`).toISOString(),
      })
      setRechargeAmount("")
      setRechargeKwh("")
      setRechargeNote("")
    } catch (saveError) {
      setError(saveError.message || "La recharge n’a pas pu être enregistrée.")
    } finally {
      setSavingRecharge(false)
    }
  }

  async function handleFinishReview() {
    if (!dailyReview.trim()) {
      setError("Saisissez ou dictez le bilan de votre journée avant de l’enregistrer.")
      return
    }
    if (!orgId) {
      setError("Votre organisation n’a pas pu être identifiée pour enregistrer le bilan.")
      return
    }
    setSavingReview(true)
    setError(null)
    try {
      if (isRecording) recognitionRef.current?.stop()
      await enregistrerBilan(dailyReview.trim())
      setReviewSaved(true)
      setDrawer?.("daily-summary")
    } catch (saveError) {
      setError(saveError.message || "Le bilan de la journée n’a pas pu être enregistré.")
    } finally {
      setSavingReview(false)
    }
  }

  if (organisationLoading || loading) {
    return <p className="drawer-lead">Chargement du rituel énergétique…</p>
  }
  if (organisationError || loadError) {
    return <p className="drawer-lead form-error">Erreur : {organisationError || loadError}</p>
  }

  return (
    <div className="ritual-clean">
      <header className="ritual-top">
        <div>
          <p className="ritual-eyebrow">SUIVI ÉNERGÉTIQUE</p>
          <h2>Le rythme de votre journée</h2>
          <p>Quatre relevés suffisent pour suivre vos consommations de 08 h à 20 h.</p>
        </div>
        <div className="ritual-controls">
          {points.length > 0 && (
            <label className="fld">
              Point de suivi
              <select
                value={selectedPoint?.id || ""}
                onChange={(event) => {
                  setValues({})
                  setNotes({})
                  setDailyReview("")
                  setReviewSaved(false)
                  setSelectedPointId(event.target.value)
                }}
              >
                {points.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.nom}{point.site_nom ? ` · ${point.site_nom}` : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="fld">
            Journée
            <input
              type="date"
              value={date}
              max={getLocalDateString()}
              onChange={(event) => {
                setValues({})
                setNotes({})
                setDailyReview("")
                setReviewSaved(false)
                setDate(event.target.value || getLocalDateString())
              }}
            />
          </label>
        </div>
      </header>

      {selectedPoint && (
        <div className="ritual-meta">
          <span>{MODES[selectedPoint.mode_mesure]}</span>
          <span>{selectedSite?.nom || "Aucun site rattaché"}</span>
          {selectedPoint.compteur_reference && <span>Compteur {selectedPoint.compteur_reference}</span>}
          <button type="button" className="ritual-add-link" onClick={() => setShowCreatePoint((shown) => !shown)}>
            <Plus size={15} /> Ajouter un suivi
          </button>
        </div>
      )}

      {(points.length === 0 || showCreatePoint) && (
        <GlassCard as="section" className="ritual-create-clean">
          <div>
            <h3>{points.length ? "Nouveau point de suivi" : "Commencer le suivi"}</h3>
            <p>Un site et un compteur ne sont pas nécessaires pour démarrer.</p>
          </div>
          <form onSubmit={handleCreatePoint} className="ritual-create-grid">
            <label className="fld">Énergie
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                {Object.entries(MODES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
            <label className="fld">Nom (facultatif)
              <input value={pointName} onChange={(event) => setPointName(event.target.value)} placeholder={mode === "SOLDE_WOYOFAL" ? "Mon suivi Woyofal" : "Mon suivi SENELEC"} />
            </label>
            <label className="fld">Site (facultatif)
              <select value={siteId} onChange={(event) => { setSiteId(event.target.value); setMeterId("") }}>
                <option value="">Aucun site</option>
                {availableSites.map((site) => <option key={site.id} value={site.id}>{site.nom}</option>)}
              </select>
            </label>
            <label className="fld">Compteur (facultatif)
              <select value={meterId} disabled={!siteId} onChange={(event) => setMeterId(event.target.value)}>
                <option value="">Aucun compteur</option>
                {siteMeters.map((meter) => <option key={meter.id} value={meter.id}>{meter.reference}</option>)}
              </select>
            </label>
            <button type="submit" className="primary-button">Créer mon suivi</button>
          </form>
        </GlassCard>
      )}

      {selectedPoint && (
        <>
          <section className="ritual-checkpoints" aria-label="Quatre relevés quotidiens">
            {RITUAL_SLOTS.map(({ time, label }, index) => {
              const reading = savedByTime.get(time)
              const slotStatus = getRitualSlotStatus(index, date, now)
              const canEnterReading = slotStatus === "OPEN" && !reading
              const slotMessage = reading
                ? "Relevé enregistré"
                : slotStatus === "UPCOMING"
                  ? `Ouverture à ${time}`
                  : slotStatus === "EXPIRED"
                    ? "Créneau terminé"
                    : "Créneau ouvert"
              return (
                <GlassCard as="article" className={`ritual-checkpoint${reading ? " complete" : ""}${canEnterReading ? " is-open" : ""}`} key={time}>
                  <div className="ritual-checkpoint-head">
                    <span>{reading ? <Check size={16} /> : time}</span>
                    <div><strong>{label}</strong><small>{time} · {slotMessage}</small></div>
                  </div>
                  {reading ? (
                    <p className="ritual-saved-value">
                      {Number(reading.valeur_kwh).toLocaleString("fr-FR", { maximumFractionDigits: 3 })}
                      <small> kWh</small>
                    </p>
                  ) : canEnterReading ? (
                    <>
                      <label className="ritual-value-label">
                        {selectedPoint.mode_mesure === "SOLDE_WOYOFAL" ? "Solde actuel" : "Index actuel"}
                        <span>kWh</span>
                      </label>
                      <input
                        className="ritual-value-input"
                        aria-label={`${label}, ${time}, valeur en kWh`}
                        type="number"
                        min="0"
                        step="0.001"
                        inputMode="decimal"
                        value={values[time] || ""}
                        onChange={(event) => setValues((current) => ({ ...current, [time]: event.target.value }))}
                        placeholder="0,000"
                      />
                      <details className="ritual-note-details">
                        <summary>Ajouter une note</summary>
                        <input
                          maxLength={500}
                          value={notes[time] || ""}
                          onChange={(event) => setNotes((current) => ({ ...current, [time]: event.target.value }))}
                          placeholder="Activité, pause, coupure…"
                          aria-label={`Note ${label}`}
                        />
                      </details>
                      <button
                        type="button"
                        className="ritual-save-button"
                        disabled={savingSlot === time || recordsLoading}
                        onClick={() => handleSaveReading(time)}
                      >
                        {savingSlot === time ? "Enregistrement…" : "Enregistrer"}
                      </button>
                    </>
                  ) : (
                    <p className="ritual-locked-message">
                      {date < getLocalDateString(now)
                        ? "Historique consultable uniquement"
                        : "La saisie de ce créneau est fermée"}
                    </p>
                  )}
                </GlassCard>
              )
            })}
          </section>

          <section className="ritual-periods" aria-label="Consommation par période">
            <div className="ritual-section-head">
              <div>
                <h3>Consommation par période</h3>
                <p>
                  {selectedPoint.mode_mesure === "SOLDE_WOYOFAL"
                    ? "Le relevé de 08 h est le solde de départ ; les recharges sont ajoutées au calcul avant de comparer les soldes suivants."
                    : "Calculée par différence entre les index consécutifs."}
                </p>
              </div>
              {recordsLoading && <span className="ritual-refresh"><Zap size={14} /> Mise à jour</span>}
            </div>
            <div className="ritual-period-grid">
              {todayIntervals.map((interval, index) => {
                const startTime = RITUAL_SLOTS[index].time
                const endTime = RITUAL_SLOTS[index + 1].time
                const previous = previousIntervals[index]
                const complete = savedByTime.has(startTime) && savedByTime.has(endTime)
                const previousComplete = previousByTime.has(startTime) && previousByTime.has(endTime)
                return (
                  <article className="ritual-period" key={startTime}>
                    <span>{startTime}–{endTime}</span>
                    <strong>{formatKwh(interval.value)}</strong>
                    <small>Veille · {previousComplete ? formatKwh(previous.value) : "Données incomplètes"}</small>
                    {complete && interval.value == null && <small className="ritual-warning">Vérifiez l’ordre ou les valeurs des relevés.</small>}
                  </article>
                )
              })}
            </div>
            <div className="ritual-day-summary" aria-live="polite">
              <article>
                <span>Consommation mesurée · 08 h–20 h</span>
                <strong>
                  {dailySummary.complete ? formatKwh(dailySummary.total) : "Journée incomplète"}
                </strong>
                {!dailySummary.complete && (
                  <small>{dailySummary.measuredCount} période{dailySummary.measuredCount === 1 ? "" : "s"} calculable{dailySummary.measuredCount === 1 ? "" : "s"} sur {dailySummary.intervalCount}</small>
                )}
              </article>
              <article>
                <span>{dailySummary.complete ? "Créneau le plus consommateur" : "Pic observé · relevés partiels"}</span>
                <strong>
                  {dailySummary.peak
                    ? `${dailySummary.peak.startTime}–${dailySummary.peak.endTime}`
                    : "À déterminer"}
                </strong>
                {dailySummary.peak && <small>{formatKwh(dailySummary.peak.value)}</small>}
              </article>
              {selectedPoint.mode_mesure === "SOLDE_WOYOFAL" && (
                <>
                  <article>
                    <span>Solde de départ · 08 h</span>
                    <strong>{formatKwh(savedByTime.get("08:00")?.valeur_kwh ?? null)}</strong>
                  </article>
                  <article>
                    <span>Solde restant · 20 h</span>
                    <strong>{formatKwh(savedByTime.get("20:00")?.valeur_kwh ?? null)}</strong>
                  </article>
                </>
              )}
            </div>
          </section>

          {selectedPoint.mode_mesure === "SOLDE_WOYOFAL" && (
            <details className="ritual-recharge">
              <summary><span>Recharges Woyofal</span><ChevronDown size={16} /></summary>
              <p>Le montant payé et les kWh crédités sont enregistrés séparément.</p>
              <form onSubmit={handleSaveRecharge} className="ritual-recharge-form">
                <label className="fld">Date de recharge
                  <input type="date" value={rechargeDate} min={previousDate} max={date} onChange={(event) => setSelectedRechargeDate(event.target.value || date)} />
                </label>
                <label className="fld">Heure de recharge
                  <input type="time" value={selectedRechargeTime} onChange={(event) => setSelectedRechargeTime(event.target.value || "12:00")} />
                </label>
                <label className="fld">Montant (FCFA)
                  <input required type="number" min="1" step="1" value={rechargeAmount} onChange={(event) => setRechargeAmount(event.target.value)} />
                </label>
                <label className="fld">kWh crédités
                  <input required type="number" min="0.001" step="0.001" value={rechargeKwh} onChange={(event) => setRechargeKwh(event.target.value)} />
                </label>
                <label className="fld">Note (facultatif)
                  <input value={rechargeNote} onChange={(event) => setRechargeNote(event.target.value)} />
                </label>
                <button type="submit" className="ritual-save-button" disabled={savingRecharge}>
                  <Save size={15} /> {savingRecharge ? "Enregistrement…" : "Ajouter la recharge"}
                </button>
              </form>
              <small className="ritual-recharge-count">{recharges.length} recharge{recharges.length === 1 ? "" : "s"} dans les journées comparées.</small>
            </details>
          )}

          <GlassCard as="section" className={`ritual-review${reviewAvailable ? " available" : ""}`}>
            <div className="ritual-review-heading">
              <div>
                <p className="ritual-eyebrow">FIN DE JOURNÉE</p>
                <h3>Comment s’est passée votre journée ?</h3>
                <p>Ajoutez les événements qui aident à comprendre vos relevés. Ce bilan rejoint la mémoire EcoScan.</p>
              </div>
              {!reviewAvailable && <span className="ritual-review-locked">Disponible à partir de 20 h</span>}
            </div>
            {reviewAvailable ? (
              <>
                <div className="ritual-review-modes" role="group" aria-label="Mode de saisie du bilan">
                  <button type="button" className={reviewMode === "text" ? "active" : ""} onClick={() => { if (isRecording) recorderRef.current?.stop(); setReviewMode("text") }}>
                    <FileText size={15} /> Écrit
                  </button>
                  <button type="button" className={reviewMode === "voice" ? "active" : ""} onClick={() => setReviewMode("voice")}>
                    <Mic size={15} /> Vocal
                  </button>
                </div>
                {reviewMode === "text" ? (
                  <textarea
                    value={dailyReview}
                    onChange={(event) => setDailyReview(event.target.value)}
                    rows={4}
                    placeholder="Ex. La production a démarré tôt. Une coupure a interrompu l’activité après midi…"
                  />
                ) : (
                  <div className="ritual-voice">
                    <button type="button" className={`ritual-voice-button${isRecording ? " recording" : ""}`} onClick={toggleVoiceCapture} disabled={isTranscribing}>
                      <Mic size={17} /> {isRecording ? "Arrêter l’enregistrement" : isTranscribing ? "Transcription…" : "Dicter mon bilan"}
                    </button>
                    <p>{dailyReview || "Enregistrez votre bilan en français. Le texte transcrit apparaîtra ici pour relecture."}</p>
                  </div>
                )}
                {voiceError && <p className="ritual-voice-hint" role="status">{voiceError}</p>}
                <div className="ritual-review-footer">
                  <button type="button" className="ritual-save-button" disabled={savingReview || reviewSaved || isRecording || isTranscribing} onClick={handleFinishReview}>
                    <Save size={15} />
                    {savingReview ? "Enregistrement…" : reviewSaved ? "Bilan enregistré" : isRecording ? "Arrêtez l’enregistrement pour transcrire" : isTranscribing ? "Transcription en cours…" : "Enregistrer le bilan"}
                  </button>
                  {reviewSaved && <span>Le bilan de cette journée est ajouté à la mémoire EcoScan.</span>}
                </div>
              </>
            ) : (
              <p className="ritual-review-wait">Les créneaux sont saisis au fil de la journée. Le récapitulatif s’ouvre lorsque la dernière période commence à 20 h.</p>
            )}
          </GlassCard>
        </>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}
