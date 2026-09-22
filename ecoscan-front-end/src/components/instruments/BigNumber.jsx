import React from 'react'

/** Grand chiffre léger : la décimale et l'unité sont réduites. "1,2" → 1 + ,2 */
export function BigNumber({ value, unit, className = '' }) {
  const [int, dec] = String(value ?? '—').split(',')
  return (
    <span className={`bignum ${className}`.trim()}>
      {int}
      {dec != null && <span className="bn-dec">,{dec}</span>}
      {unit && <span className="bn-unit">{unit}</span>}
    </span>
  )
}
