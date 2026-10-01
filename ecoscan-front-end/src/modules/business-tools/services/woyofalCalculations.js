export const YESTERDAY_BASELINE = 12000

export const WOYOFAL_SLOTS = [
  ["matin", "08:00", "Début de journée"],
  ["midi", "12:00", "Pause méridienne"],
  ["apresmidi", "16:00", "Pic d’activité"],
  ["soir", "20:00", "Fin de journée"],
]

export const RITUAL_SLOTS = [
  { time: "08:00", label: "Matin" },
  { time: "12:00", label: "Midi" },
  { time: "16:00", label: "Après-midi" },
  { time: "20:00", label: "Soir" },
]

export function calculateSlotDelta(value, previousValue) {
  if (!value) return 0
  return Math.max(0, Number(value) - Number(previousValue || 0))
}

export function calculateDayCumulative(slotValues, baseline = YESTERDAY_BASELINE) {
  const values = Object.values(slotValues).filter(Boolean)
  if (!values.length) return 0
  return Math.max(0, Number(values[values.length - 1]) - baseline)
}

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getPreviousDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number)
  const previousDate = new Date(year, month - 1, day)
  previousDate.setDate(previousDate.getDate() - 1)
  return getLocalDateString(previousDate)
}

export function getRitualSlotStatus(index, selectedDate, now = new Date()) {
  const today = getLocalDateString(now)
  if (selectedDate < today) return "EXPIRED"
  if (selectedDate > today) return "UPCOMING"

  const [hour, minute] = RITUAL_SLOTS[index].time.split(":").map(Number)
  const slotStart = hour * 60 + minute
  const nextSlot = RITUAL_SLOTS[index + 1]
  const slotEnd = nextSlot
    ? nextSlot.time.split(":").map(Number).reduce((hours, mins) => hours * 60 + mins)
    : 24 * 60
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  if (currentMinutes < slotStart) return "UPCOMING"
  if (currentMinutes < slotEnd) return "OPEN"
  return "EXPIRED"
}

export function isDailyReviewAvailable(selectedDate, now = new Date()) {
  const today = getLocalDateString(now)
  if (selectedDate < today) return true
  if (selectedDate > today) return false
  return now.getHours() >= 20
}

function getRechargeTime(recharge) {
  const date = new Date(recharge.effectuee_le)
  if (Number.isNaN(date.getTime())) return null
  return `${getLocalDateString(date)}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

export function calculateIntervalConsumption({
  startReading,
  endReading,
  mode,
  recharges = [],
  date,
  startTime,
  endTime,
}) {
  if (!startReading || !endReading) return null

  if (startReading.valeur_kwh == null || endReading.valeur_kwh == null) return null
  const startValue = Number(startReading.valeur_kwh)
  const endValue = Number(endReading.valeur_kwh)
  if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) return null

  if (mode === "INDEX_CUMULATIF") {
    return endValue >= startValue ? endValue - startValue : null
  }
  if (mode !== "SOLDE_WOYOFAL") return null

  const intervalStart = `${date}T${startTime}`
  const intervalEnd = `${date}T${endTime}`
  const creditedKwh = recharges.reduce((total, recharge) => {
    const rechargeTime = getRechargeTime(recharge)
    const credit = Number(recharge.kwh_credites)
    if (rechargeTime && Number.isFinite(credit) && rechargeTime > intervalStart && rechargeTime <= intervalEnd) {
      return total + credit
    }
    return total
  }, 0)

  const consumption = startValue + creditedKwh - endValue
  return consumption >= 0 ? consumption : null
}

export function getDailyIntervals({ readings, mode, recharges, date }) {
  const readingsBySlot = new Map(readings.map((reading) => [reading.creneau, reading]))

  return RITUAL_SLOTS.slice(0, -1).map((slot, index) => ({
    startTime: slot.time,
    endTime: RITUAL_SLOTS[index + 1].time,
    value: calculateIntervalConsumption({
      startReading: readingsBySlot.get(slot.time),
      endReading: readingsBySlot.get(RITUAL_SLOTS[index + 1].time),
      mode,
      recharges,
      date,
      startTime: slot.time,
      endTime: RITUAL_SLOTS[index + 1].time,
    }),
  }))
}

export function summarizeDailyConsumption(intervals) {
  const measured = intervals.filter((interval) => Number.isFinite(interval.value) && interval.value >= 0)
  const peak = measured.reduce(
    (current, interval) => interval.value > (current?.value ?? -Infinity) ? interval : current,
    null,
  )
  const complete = intervals.length > 0 && measured.length === intervals.length

  return {
    complete,
    measuredCount: measured.length,
    intervalCount: intervals.length,
    total: complete ? measured.reduce((sum, interval) => sum + interval.value, 0) : null,
    peak,
  }
}
