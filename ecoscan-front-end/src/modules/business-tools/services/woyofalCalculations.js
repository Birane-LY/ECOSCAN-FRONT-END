export const YESTERDAY_BASELINE = 12000

export const WOYOFAL_SLOTS = [
  ['matin', '08:00', 'Début de journée'],
  ['midi', '12:00', 'Pause méridienne'],
  ['apresmidi', '16:00', 'Pic d’activité'],
  ['soir', '20:00', 'Fin de journée'],
]

/**
 * Calculates consumption delta for a given slot.
 * @param {string|number} value
 * @param {string|number} previousValue
 * @returns {number}
 */
export function calculateSlotDelta(value, previousValue) {
  if (!value) return 0
  return Math.max(0, Number(value) - Number(previousValue || 0))
}

/**
 * Calculates cumulative daily consumption from slot values against a baseline.
 * @param {Record<string, string>} slotValues
 * @param {number} baseline
 * @returns {number}
 */
export function calculateDayCumulative(slotValues, baseline = YESTERDAY_BASELINE) {
  const values = Object.values(slotValues).filter(Boolean)
  if (!values.length) return 0
  const lastValue = Number(values[values.length - 1])
  return Math.max(0, lastValue - baseline)
}
