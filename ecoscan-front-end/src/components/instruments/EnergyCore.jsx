import React, { useId, useMemo } from 'react'

/**
 * Objet central du héros : un cadran d'énergie suspendu, entièrement en SVG.
 * Le canevas fait 1200 × 560 : le cœur est au centre (600, 280), les quatre
 * lignes de repérage partent de l'anneau vers les cartes HTML posées à gauche
 * et à droite (voir .hero-card dans rebrand.css : mêmes coordonnées en %).
 * Tout est thémé par les variables CSS (--core-*, --signal, --neo-*).
 */
const CX = 600
const CY = 280
const START = 135 // le cadran s'ouvre vers le bas, comme un vrai instrument
const SWEEP = 270
const rad = (d) => (d * Math.PI) / 180
const pt = (r, deg) => [CX + r * Math.cos(rad(deg)), CY + r * Math.sin(rad(deg))]

// Lignes de repérage : angle sur l'anneau, côté (-1 gauche, 1 droite), hauteur d'accroche
const LEADERS = [
  { id: 'tl', ang: 215, side: -1, ey: 108 },
  { id: 'bl', ang: 145, side: -1, ey: 452 },
  { id: 'tr', ang: 325, side: 1, ey: 108 },
  { id: 'br', ang: 35, side: 1, ey: 452 },
]

export function EnergyCore({ score = 84, delta = '+6 pts ce mois', label = 'Score EcoScan' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const v = Math.max(0, Math.min(100, Number(score) || 0))

  const g = useMemo(() => {
    const arcR = 190
    const [sx, sy] = pt(arcR, START)
    const [ex, ey] = pt(arcR, START + SWEEP)
    const ticks = Array.from({ length: 51 }, (_, i) => {
      const a = START + (SWEEP * i) / 50
      const major = i % 10 === 0
      const [x1, y1] = pt(major ? 216 : 223, a)
      const [x2, y2] = pt(236, a)
      return { i, x1, y1, x2, y2, major, on: i * 2 <= v }
    })
    const scale = [0, 20, 40, 60, 80, 100].map((n) => {
      const [x, y] = pt(208, START + (SWEEP * n) / 100)
      return { n, x, y }
    })
    const dots = Array.from({ length: 72 }, (_, i) => pt(150, (360 * i) / 72))
    const [wx, wy] = pt(104, 68)
    const leaders = LEADERS.map((l, i) => {
      const [ax, ay] = pt(246, l.ang)
      const p1x = ax + l.side * 46
      const p2x = p1x + l.side * 34
      const p3x = CX + l.side * 304
      return {
        ...l,
        ax,
        ay,
        p3x,
        d: `M ${ax} ${ay} L ${p1x} ${ay} L ${p2x} ${l.ey} L ${p3x} ${l.ey}`,
        delay: `${1.25 + i * 0.12}s`,
      }
    })
    return {
      arcR,
      arcPath: `M ${sx} ${sy} A ${arcR} ${arcR} 0 1 1 ${ex} ${ey}`,
      ticks,
      scale,
      dots,
      wedge: `M ${CX} ${CY} L ${CX + 104} ${CY} A 104 104 0 0 1 ${wx} ${wy} Z`,
      leaders,
    }
  }, [v])

  const id = (n) => `${uid}-${n}`

  return (
    <svg
      className="hero-svg"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Score EcoScan : ${v} sur 100`}
    >
      <defs>
        <radialGradient id={id('glowBig')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="core-glow-s" stopOpacity="0.26" />
          <stop offset="100%" className="core-glow-s" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="core-glow-s" stopOpacity="0.42" />
          <stop offset="100%" className="core-glow-s" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('disc')} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" className="core-disc-a" />
          <stop offset="55%" className="core-disc-b" />
          <stop offset="100%" className="core-disc-c" />
        </linearGradient>
        <linearGradient id={id('arc')} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" className="core-arc-a" />
          <stop offset="100%" className="core-arc-b" />
        </linearGradient>
        <radialGradient id={id('sphere')} cx="38%" cy="30%" r="80%">
          <stop offset="0%" className="core-sph-0" />
          <stop offset="34%" className="core-sph-1" />
          <stop offset="70%" className="core-sph-2" />
          <stop offset="100%" className="core-sph-3" />
        </radialGradient>
        <linearGradient id={id('wedge')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={id('spec')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={id('shDark')} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="14" dy="20" stdDeviation="18" className="fl-dark" />
        </filter>
        <filter id={id('shLight')} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="-10" dy="-14" stdDeviation="14" className="fl-light" />
        </filter>
        <filter id={id('blur')} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={id('soft')} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* lumière ambiante et ombre au sol : l'objet est suspendu */}
      <circle cx={CX} cy={CY} r="320" fill={`url(#${id('glowBig')})`} />
      <ellipse cx={CX} cy={CY + 258} rx="210" ry="14" className="core-ground" filter={`url(#${id('soft')})`} />

      {/* anneau de graduations */}
      <circle cx={CX} cy={CY} r="246" className="core-hair" />
      {g.ticks.map((t) => (
        <line
          key={t.i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          className={`core-tick ${t.major ? 'major' : ''} ${t.on ? 'on' : ''}`}
          style={{ '--i': t.i }}
        />
      ))}
      {g.scale.map((s) => (
        <text key={s.n} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="central" className="core-scale">
          {s.n}
        </text>
      ))}

      {/* piste + arc de valeur */}
      <path d={g.arcPath} className="core-track" />
      <path
        d={g.arcPath}
        pathLength="100"
        className="core-arc-glow"
        stroke={`url(#${id('arc')})`}
        filter={`url(#${id('blur')})`}
        style={{ '--v': v }}
      />
      <path d={g.arcPath} pathLength="100" className="core-arc" stroke={`url(#${id('arc')})`} style={{ '--v': v }} />
      <g className="core-marker" style={{ '--sweep': `${(SWEEP * v) / 100}deg` }}>
        <circle cx={CX + g.arcR} cy={CY} r="10" className="core-marker-ring" />
        <circle cx={CX + g.arcR} cy={CY} r="4" className="core-marker-dot" />
      </g>

      {/* disque néomorphe */}
      <circle cx={CX} cy={CY} r="172" fill={`url(#${id('disc')})`} filter={`url(#${id('shDark')})`} />
      <circle cx={CX} cy={CY} r="172" fill={`url(#${id('disc')})`} filter={`url(#${id('shLight')})`} />
      <circle cx={CX} cy={CY} r="160" className="core-hair" />
      {g.dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.7" className="core-dot" />
      ))}
      <circle cx={CX} cy={CY} r="150" fill={`url(#${id('glow')})`} />

      {/* noyau */}
      <circle cx={CX} cy={CY} r="104" fill={`url(#${id('sphere')})`} />
      <g className="core-sweep">
        <path d={g.wedge} fill={`url(#${id('wedge')})`} />
      </g>
      <circle cx={CX} cy={CY} r="104" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <ellipse
        cx={CX - 32}
        cy={CY - 54}
        rx="58"
        ry="28"
        transform={`rotate(-24 ${CX - 32} ${CY - 54})`}
        fill={`url(#${id('spec')})`}
      />
      <text x={CX} y={CY - 58} textAnchor="middle" className="core-label">
        {label}
      </text>
      <text x={CX} y={CY + 6} textAnchor="middle" dominantBaseline="central" className="core-num">
        {v}
      </text>
      <text x={CX} y={CY + 58} textAnchor="middle" className="core-label">
        sur 100
      </text>

      {/* variation, posée dans l'ouverture du cadran */}
      {delta && (
        <g>
          <rect x={CX - 82} y={CY + 188} width="164" height="32" rx="16" className="core-chip" />
          <text x={CX} y={CY + 204.5} textAnchor="middle" dominantBaseline="central" className="core-chip-text">
            {delta}
          </text>
        </g>
      )}

      {/* lignes de repérage vers les cartes */}
      <g className="leaders">
        {g.leaders.map((l) => (
          <g key={l.id} style={{ '--d': l.delay }}>
            <path d={l.d} pathLength="100" className="leader" />
            <circle cx={l.ax} cy={l.ay} r="5.5" className="leader-anchor leader-dot" />
            <circle cx={l.p3x} cy={l.ey} r="3" className="leader-end leader-dot" />
          </g>
        ))}
      </g>
    </svg>
  )
}
