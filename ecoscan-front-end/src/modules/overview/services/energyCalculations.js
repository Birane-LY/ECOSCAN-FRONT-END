/**
 * Résumé de consommation calculé sur une série réelle
 * (points {value, target} tels que produits par useOverviewData).

 * @param {Array<{value:number,target?:number}>} serie
 * @returns {{ total: string, change: string }}
 */
export function getPeriodConsumptionSummary(serie = []) {
  if (!Array.isArray(serie) || serie.length === 0) return { total: '0', change: '—' }

  const total = serie.reduce((a, p) => a + (Number(p.value) || 0), 0)
  const cible = serie.reduce((a, p) => a + (Number(p.target) || 0), 0)
  const fmt = (n) => Math.round(n).toLocaleString('fr-FR')

  if (cible > 0) {
    const ecart = Math.round(((total - cible) / cible) * 100)
    return { total: fmt(total), change: ecart <= 0 ? `↓ ${Math.abs(ecart)} %` : `↑ ${ecart} %` }
  }
  if (serie.length >= 2) {
    const prev = Number(serie[serie.length - 2].value) || 0
    const last = Number(serie[serie.length - 1].value) || 0
    if (prev > 0) {
      const ecart = Math.round(((last - prev) / prev) * 100)
      return { total: fmt(total), change: ecart <= 0 ? `↓ ${Math.abs(ecart)} %` : `↑ ${ecart} %` }
    }
  }
  return { total: fmt(total), change: '—' }
}

/**
 * Intensité d'un point : consommation × facteur d'émission (kg CO₂ / kWh).
 * Le facteur doit venir du FacteurEmission réglementaire ; 
 * @param {number} value  kWh
 * @param {number} facteurKgParKwh
 * @returns {number} kg CO₂
 */
export function calculatePointIntensity(value, facteurKgParKwh) {
  const facteur = Number(facteurKgParKwh)
  if (!Number.isFinite(facteur)) return 0
  return (Number(value) || 0) * facteur
}
