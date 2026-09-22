// Géométrie de la constellation : un noyau (l'organisation), quatre pôles par
// statut, et une feuille par mémoire ou hypothèse. Disposition radiale
// déterministe : le même jeu de données donne toujours le même dessin.

export const W = 1000
export const H = 640
export const CX = 500
export const CY = 320

export const GROUPS = [
  { id: 'CONFIRMEE', label: 'Confirmées', angle: -140, tone: 'ok' },
  { id: 'PARTIELLE', label: 'Partiellement confirmées', angle: -40, tone: 'gold' },
  { id: 'A_VERIFIER', label: 'À vérifier', angle: 40, tone: 'alert' },
  { id: 'HYPOTHESE', label: 'Hypothèses en attente', angle: 140, tone: 'pearl' },
]

const HUB_RADIUS = 165
const RINGS = [285, 350]
const MAX_PER_GROUP = 16

const rad = (d) => (d * Math.PI) / 180
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const polar = (r, deg, squash = 1) => [CX + r * Math.cos(rad(deg)), CY + r * squash * Math.sin(rad(deg))]

export function groupOf(m) {
  if (m.statut === 'CONFIRMEE') return 'CONFIRMEE'
  if (m.statut === 'PARTIELLEMENT_CONFIRMEE') return 'PARTIELLE'
  return 'A_VERIFIER'
}

export const monthKey = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function buildGraph({ memoires = [], hypotheses = [], hidden = new Set() }) {
  const by = { CONFIRMEE: [], PARTIELLE: [], A_VERIFIER: [], HYPOTHESE: [] }

  ;[...memoires]
    .sort((a, b) => new Date(b.date_creation || 0) - new Date(a.date_creation || 0))
    .forEach((m) => by[groupOf(m)].push({ kind: 'memoire', id: `m-${m.id}`, raw: m, title: m.titre }))
  hypotheses.forEach((h) => by.HYPOTHESE.push({ kind: 'hypothese', id: `h-${h.id}`, raw: h, title: h.texte }))

  const maxImpact = Math.max(1, ...memoires.map((m) => Math.abs(Number(m.impact_attendu_fcfa) || 0)))
  const nodes = []
  const edges = []

  GROUPS.forEach((g) => {
    const items = by[g.id]
    if (hidden.has(g.id)) return

    const [hx, hy] = polar(HUB_RADIUS, g.angle)
    const hubId = `g-${g.id}`
    nodes.push({
      id: hubId,
      kind: 'hub',
      group: g.id,
      tone: g.tone,
      label: g.label,
      count: items.length,
      extra: Math.max(0, items.length - MAX_PER_GROUP),
      x: hx,
      y: hy,
      r: 20,
    })
    edges.push({ id: `e-c-${g.id}`, type: 'trunk', group: g.id, hub: hubId, d: `M ${CX} ${CY} L ${hx} ${hy}` })

    const shown = items.slice(0, MAX_PER_GROUP)
    const rings = shown.length <= 7 ? [shown, []] : [shown.filter((_, i) => i % 2 === 0), shown.filter((_, i) => i % 2 === 1)]

    rings.forEach((ringItems, ri) => {
      const m = ringItems.length
      const span = Math.min(88, m * 15)
      ringItems.forEach((it, k) => {
        const a = g.angle + span * ((k + 0.5) / m - 0.5)
        const [px, py] = polar(RINGS[ri], a, 0.78) // ellipse : le dessin reste dans le cadre 1000 × 640
        const x = clamp(px, 34, W - 34)
        const y = clamp(py, 34, H - 34)
        const impact = Math.abs(Number(it.raw.impact_attendu_fcfa) || 0)
        const r = it.kind === 'hypothese' ? 10 : impact ? 9 + 9 * Math.sqrt(impact / maxImpact) : 11
        nodes.push({ id: it.id, kind: it.kind, group: g.id, tone: g.tone, raw: it.raw, title: it.title, x, y, r })

        const mx = (hx + x) / 2
        const my = (hy + y) / 2
        const dx = x - hx
        const dy = y - hy
        const bend = (k % 2 === 0 ? 1 : -1) * 0.12
        edges.push({
          id: `e-${it.id}`,
          type: 'branch',
          group: g.id,
          hub: hubId,
          leaf: it.id,
          d: `M ${hx} ${hy} Q ${mx - dy * bend} ${my + dx * bend} ${x} ${y}`,
        })
      })
    })
  })

  return { nodes, edges }
}
