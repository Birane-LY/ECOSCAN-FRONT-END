'use client'

import React, { useMemo, useState } from 'react'
import { CX, CY, H, W } from './memoryLayout'

const TONES = {
  ok: 'var(--mem-ok)',
  gold: 'var(--mem-gold)',
  alert: 'var(--mem-alert)',
  pearl: 'var(--mem-pearl)',
}

const GROUP_TONES = {
  CONFIRMEE: 'ok',
  PARTIELLE: 'gold',
  A_VERIFIER: 'alert',
  HYPOTHESE: 'pearl',
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
      <g className="mg-zoom" style={{ transform: `scale(${zoom})` }}>
        {edges.map((e) => (
          <path
            key={e.id}
            d={e.d}
            className={`mg-edge ${e.type} ${edgeState(e)} tone-${GROUP_TONES[e.group]}`}
          />
        ))}

        {nodes.map((n) => {
          const isLeaf = n.kind !== 'hub'
          const selected = selectedId === n.id
          const showLabel = isLeaf && (focusId === n.id || selected)
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              className={`mg-node ${n.kind} tone-${n.tone} ${dim(n.id)} ${selected ? 'is-sel' : ''}`}
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
              <g className="mg-pop">
                <circle r={n.r + 10} className="mg-hit" />
                <circle r={n.r + 5} className="mg-ring" />
                <circle r={n.r} fill={TONES[n.tone]} className="mg-sphere" strokeDasharray={n.kind === 'hypothese' ? '3 3' : undefined} />
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
          className={`mg-node center tone-core ${dim('center')}`}
          onPointerEnter={() => setHoverId('center')}
          onPointerLeave={() => setHoverId(null)}
        >
          <g className="mg-pop">
            <circle r="52" className="mg-ring" />
            <circle r="38" fill="var(--mem-core)" className="mg-sphere" />
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
