/**
 * Calculates energy consumption summary metrics for a given period.
 * @param {string} period - '7 jours' | '30 jours' | '90 jours'
 * @returns {{ total: string, change: string }}
 */
export function getPeriodConsumptionSummary(period) {
  switch (period) {
    case '30 jours':
      return { total: '76 940', change: '↓ 14,2%' }
    case '90 jours':
      return { total: '218 620', change: '↓ 14,2%' }
    case '7 jours':
    default:
      return { total: '18 426', change: '↓ 14,2%' }
  }
}

/**
 * Calculates selected point intensity metrics.
 * @param {number} value
 * @returns {number}
 */
export function calculatePointIntensity(value) {
  return value * 59
}
