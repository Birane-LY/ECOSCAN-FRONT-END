/**
 * Calculates ROI percentage over 12 months.
 * @param {number} cost - Implementation cost in FCFA
 * @param {number} savings - Monthly savings in FCFA
 * @returns {number}
 */
export function calculateROI(cost, savings) {
  if (!cost) return 0
  return Math.round(((savings * 12 - cost) / cost) * 100)
}

/**
 * Calculates payback period in months.
 * @param {number} cost
 * @param {number} savings
 * @returns {string}
 */
export function calculatePayback(cost, savings) {
  if (!savings) return '0'
  return (cost / savings).toFixed(1)
}

/**
 * Calculates net gain over 12 months.
 * @param {number} cost
 * @param {number} savings
 * @returns {number}
 */
export function calculateNetGain(cost, savings) {
  return savings * 12 - cost
}
