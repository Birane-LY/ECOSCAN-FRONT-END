'use client'

import React, { useMemo, useState } from 'react'
import { CX, CY, H, W } from './memoryLayout'

const TONES = {
  ok: ['#9af0ec', '#1f91a6'],
  gold: ['#ffeaa0', '#c8901a'],
  alert: ['#ffc2ba', '#d6453e'],
  pearl: ['#ffffff', '#a9bccf'],
}

const short = (s = '', n = 38) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

/** Constellation SVG. Survol : le reste s'estompe. Clic ou Entrée : ouvre le détail. */
export function MemoryGraph({ nodes, edges, orgName, total, selectedId, onSelect, zoom = 1 }) {
  const [hoverId, setHoverId] = useState(null)
  const focusId = hoverId ?? selectedId

  const linked = useMemo(() => {
    if (!focusId) return null
    const set = new Set([focusId, 'center'])
    const n = nodes.find((x) => x.id === focusId)
    if (!n) return null
    if (n.kind === 'hub') {
      set.add(n.id)
      nodes.filter((x) => x.group === n.group).forEach((x) => set.add(x.id))
    } else {
      set.add(`g-${n.group}`)
    }
    return set
  }, [focusId, nodes])

  const dim = (id) => (linked && !linked.has(id) ? 'dim' : '')
  const focusNode = nodes.find((x) => x.id === focusId)
  const edgeState = (e) => {
    if (!focusId) return ''
    if (focusId === 'center') return 'hot'
    if (!focusNode) return ''
    if (e.type === 'trunk') return focusNode.group === e.group ? 'hot' : 'dim'
    return focusId === e.leaf || focusId === e.hub ? 'hot' : 'dim'
  }

  const activate = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id)
    }
  }

  return (
    <svg className="mg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label="Constellation de la mémoire stratégique">
      <defs>
        {Object.entries(TONES).map(([k, [a, b]]) => (
          <radialGradient key={k} id={`mg-${k}`} cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </radialGradient>
        ))}
        <radialGradient id="mg-core" cx="36%" cy="30%" r="80%">
          <stop offset="0%" className="core-sph-0" />
          <stop offset="100%" className="core-sph-2" />
        </radialGradient>
        <radialGradient id="mg-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" className="core-glow-s" stopOpacity="0.32" />
          <stop offset="100%" className="core-glow-s" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="mg-zoom" style={{ transform: `scale(${zoom})` }}>
        <circle cx={CX} cy={CY} r="230" fill="url(#mg-halo)" />

        {edges.map((e, i) => (
          <path
            key={e.id}
            d={e.d}
            pathLength="100"
            className={`mg-edge ${e.type} ${edgeState(e)}`}
            style={{ '--i': i }}
          />
        ))}

        {nodes.map((n, i) => {
          const isLeaf = n.kind !== 'hub'
          const selected = selectedId === n.id
          const showLabel = isLeaf && (focusId === n.id || selected)
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              className={`mg-node ${n.kind} ${dim(n.id)} ${selected ? 'is-sel' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={isLeaf ? `${n.kind === 'hypothese' ? 'Hypothèse' : 'Mémoire'} : ${short(n.title, 80)}` : `${n.label}, ${n.count}`}
              aria-pressed={selected}
              onPointerEnter={() => setHoverId(n.id)}
              onPointerLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(n.id)}
              onBlur={() => setHoverId(null)}
              onClick={() => onSelect(n.id)}
              onKeyDown={(e) => activate(e, n.id)}
            >
              <g className="mg-pop" style={{ '--i': i }}>
                <circle r={n.r + 10} className="mg-hit" />
                <circle r={n.r + 5} className="mg-ring" />
                <circle r={n.r} fill={`url(#mg-${n.tone})`} className="mg-sphere" strokeDasharray={n.kind === 'hypothese' ? '3 3' : undefined} />
                <ellipse cx={-n.r * 0.3} cy={-n.r * 0.38} rx={n.r * 0.42} ry={n.r * 0.24} className="mg-spec" />
                {n.kind === 'hub' && (
                  <text y={n.r + 20} textAnchor="middle" className="mg-label hub">
                    {n.label}
                    <tspan className="mg-count" dx="6">{n.count}{n.extra ? ` (+${n.extra})` : ''}</tspan>
                  </text>
                )}
                {showLabel && (
                  <text y={n.group === 'A_VERIFIER' || n.group === 'HYPOTHESE' ? n.r + 20 : -n.r - 12} textAnchor="middle" className="mg-label leaf">
                    {short(n.title)}
                  </text>
                )}
              </g>
            </g>
          )
        })}

        {/* noyau : l'organisation, avec le nombre de mémoires en chiffres points */}
        <g
          transform={`translate(${CX} ${CY})`}
          className={`mg-node center ${dim('center')}`}
          onPointerEnter={() => setHoverId('center')}
          onPointerLeave={() => setHoverId(null)}
        >
          <g className="mg-pop" style={{ '--i': 0 }}>
            <circle r="52" className="mg-ring" />
            <circle r="38" fill="url(#mg-core)" className="mg-sphere" />
            <ellipse cx="-12" cy="-16" rx="17" ry="9" className="mg-spec" />
            <text y="2" textAnchor="middle" dominantBaseline="central" className="mg-center-num">
              {total}
            </text>
            <text y="70" textAnchor="middle" className="mg-label hub">
              {orgName}
            </text>
          </g>
        </g>
      </g>
    </svg>
  )
}
