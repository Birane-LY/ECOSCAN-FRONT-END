import React from 'react'

const fmt = (n) => Math.round(n).toLocaleString('fr-FR')

function niceCeil(n) {
  if (n <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(n)))
  const m = n / p
  const step = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10
  return step * p
}

/**
 * Barres en traits fins : valeur (orange) contre référence (gris).
 * data : [{ label, full, value, target }]
 * compact : version miniature, sans axes ni infobulle.
 */
export function RangeBars({
  data = [],
  unit = 'kWh',
  selected = null,
  highlight = null,
  onSelect,
  showTarget = true,
  compact = false,
}) {
  const peak = Math.max(1, ...data.map((d) => Math.max(d.value, showTarget ? d.target : 0)))
  const top = niceCeil(peak * 1.12)
  const ticks = [top, (top * 2) / 3, top / 3, 0]
  const sel = selected != null ? data[selected] : null
  const x = selected != null ? ((selected + 0.5) / Math.max(1, data.length)) * 100 : 0

  return (
    <div className={`rb ${compact ? 'rb-compact' : ''}`} style={{ height: '100%' }}>
      {!compact && (
        <div className="rb-y" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={i}>{fmt(t)}</span>
          ))}
        </div>
      )}

      <div className="rb-plot">
        {!compact && (
          <div className="rb-grid" aria-hidden="true">
            {ticks.map((_, i) => (
              <i key={i} />
            ))}
          </div>
        )}

        <div className="rb-cols">
          {data.map((d, i) => (
            <button
              key={i}
              type="button"
              data-silent
              className={`rb-col ${selected === i ? 'is-sel' : ''} ${highlight === i ? 'is-hi' : ''}`}
              onClick={() => onSelect?.(i, d)}
              aria-label={`${d.full || d.label} : ${fmt(d.value)} ${unit}`}
            >
              {showTarget && <i className="rb-t" style={{ height: `${(d.target / top) * 100}%` }} />}
              <i
                className={`rb-v ${d.value > d.target ? 'over' : ''}`}
                style={{ height: `${(d.value / top) * 100}%` }}
              />
            </button>
          ))}
        </div>

        {!compact && sel && (
          <>
            <div className="rb-guide" style={{ left: `${x}%` }} aria-hidden="true" />
            <div
              className="rb-tip"
              aria-hidden="true"
              style={{ left: `clamp(70px, ${x}%, calc(100% - 70px))` }}
            >
              <b>
                {fmt(sel.value)} {unit}
              </b>
              <small>{sel.full || sel.label}</small>
            </div>
          </>
        )}
      </div>

      <div className="rb-x" aria-hidden="true">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}
