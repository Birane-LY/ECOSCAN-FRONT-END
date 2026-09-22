'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Globe en matrice de points centré sur l'Afrique de l'Ouest (Canvas 2D).
 * Les continents sont des polygones grossiers (lon, lat) ; chaque point de la
 * grille qui tombe dedans devient un point lumineux. Dakar est le nœud
 * principal, relié à quelques villes par des arcs en grand cercle.
 * Sans mouvement (prefers-reduced-motion), une seule image est dessinée.
 */
const DEG = Math.PI / 180

const POLYS = [
  // Afrique
  [[-5.9,35.8],[-2,35.1],[3,36.8],[10,37.2],[11,33.5],[12,32.9],[19.5,30.5],[20,32.5],[25,31.6],[29,30.9],[32,31.3],[32.6,29.9],[34.2,27.8],[35.5,24],[37.2,21],[38.5,18],[39.5,15.5],[43.3,12.7],[44,10.4],[51.2,11.8],[49,6],[45,2],[41,-1.7],[39.3,-4.6],[38.8,-6.9],[40.4,-10.5],[40.6,-15],[35.5,-21.5],[35.3,-24],[32.9,-26],[31,-29.9],[27,-33.7],[22,-34.2],[18.4,-34.1],[17.9,-31],[15,-27],[14.4,-22.4],[11.7,-17.3],[13.7,-11.7],[12.3,-6],[9.3,-0.5],[9.5,1],[9.8,3.9],[8.5,4.4],[6.3,4.3],[4.4,6.3],[1.2,6.1],[-2,4.7],[-4,5.2],[-7.5,4.4],[-11.3,6.9],[-13.2,8.5],[-15.6,11.8],[-16.7,13.5],[-17.5,14.7],[-16.5,16.5],[-16.2,19.5],[-17,21],[-15,23.5],[-13,27.7],[-10,29.5],[-9.6,31],[-9.8,32.5],[-7.6,33.6],[-6.8,34.5]],
  // Madagascar
  [[43.5,-25],[47,-25],[50.3,-15.5],[49.5,-12],[47.5,-15],[44,-17],[43.3,-22]],
  // Europe
  [[-5.3,36.1],[-9.5,36.9],[-9.5,43.2],[-1.8,43.4],[-1.3,46.2],[-4.6,48.4],[-1.5,49.7],[1.6,50.9],[4.5,52],[8.5,53.8],[8.3,57],[10.6,57.7],[10.6,54.8],[14,54.3],[19,54.6],[21,57],[24.5,57.5],[24.5,59.5],[30,60],[28,62],[25,65],[21,63],[17,61],[19,59],[16,56],[13,55.5],[11,58],[6,58.5],[5,62],[12,66],[18,69.5],[25,71],[30,70],[41,67],[45,66],[45,50],[40,47],[37,45.3],[33.5,45],[31,46.5],[29.7,45.3],[28.7,43.5],[28,41.5],[26.3,40.2],[24,40.5],[23.5,38],[22.5,36.5],[21,38.5],[19.5,41.8],[18.5,42.6],[16,43.6],[13.7,45.3],[12.3,45.3],[13.6,43.6],[16,41.9],[18.5,40.2],[16.5,38.1],[15.7,38],[16.2,39.5],[15,40.2],[12,41.7],[10,43.5],[8.8,44.4],[7.5,43.8],[3,43.2],[3.2,42],[-0.3,39.5],[0,38.8],[-2,36.7]],
  // Îles britanniques
  [[-5.5,50],[1.5,51],[1.8,52.8],[-0.2,54],[-2,56.5],[-1.8,58.6],[-5.5,58.6],[-6,56],[-3,54.5],[-4.8,53.4],[-4.5,52]],
  [[-10,52],[-6,52],[-6,55],[-8.5,55]],
  // Turquie, Proche-Orient, Arabie, Iran
  [[26,40.8],[28.5,41.2],[31,41.1],[35,42],[41.5,41.5],[45,41],[48.5,38.5],[50,37],[54,37.2],[58,37.5],[61,36.5],[61.5,31],[63.5,26],[61.5,25.2],[57,25.8],[56.5,27.2],[54,26.6],[51.5,27.8],[50,30],[48.5,29.8],[50.5,26.2],[51.6,24.3],[54,24.2],[56,26.3],[56.5,24.5],[59.8,22.5],[57.5,19],[52,16.2],[45,12.9],[43.3,12.7],[42.8,15.5],[40,20],[37,24.5],[35,28.2],[34.9,29.5],[34.3,31.3],[35.1,33.1],[36,34.5],[36.2,36.5],[32,36.2],[28,36.8],[26.5,38.5]],
  // Inde
  [[68,23.5],[72,21],[73,17],[74.5,12],[77,8.2],[80,10],[80,15.5],[85,19.5],[87,21.5],[89,22],[88,26.5],[92,26.5],[92,28],[85,28],[80,30.5],[76,34],[74,35],[73,32],[71,28],[70,25]],
  // Amérique du Sud
  [[-34.8,-7],[-35,-9],[-39,-13],[-39,-18],[-41,-22],[-45,-23.5],[-48.5,-26],[-49,-29],[-53,-34],[-57,-35],[-58.5,-38.5],[-62,-39],[-65,-41],[-66,-47],[-68,-50],[-69,-55],[-72,-54],[-74,-48],[-73,-40],[-71.5,-30],[-70,-18],[-76,-14],[-81,-5],[-80,0],[-77,7.5],[-72,12],[-64,10.5],[-60,8.5],[-55,6],[-51,4.5],[-50,0],[-45,-1.5],[-41,-3],[-37,-5]],
]

const CITIES = [
  { n: 'Dakar', lon: -17.47, lat: 14.69, hub: true },
  { n: 'Casablanca', lon: -7.6, lat: 33.6 },
  { n: 'Paris', lon: 2.35, lat: 48.85 },
  { n: 'Abidjan', lon: -4.0, lat: 5.3 },
  { n: 'Lagos', lon: 3.4, lat: 6.5 },
  { n: 'Le Caire', lon: 31.2, lat: 30 },
  { n: 'Nairobi', lon: 36.8, lat: -1.3 },
  { n: 'Johannesburg', lon: 28, lat: -26 },
  { n: 'Dubaï', lon: 55.3, lat: 25.3 },
  { n: 'Kinshasa', lon: 15.3, lat: -4.3 },
]

function inside(lon, lat, poly) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

// Générateur pseudo-aléatoire déterministe : le dessin est identique à chaque chargement
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

function buildDots() {
  const rand = rng(42)
  const land = []
  const ocean = []
  const step = 1.7
  for (let lat = -60; lat <= 74; lat += step) {
    const lonStep = step / Math.max(Math.cos(lat * DEG), 0.3)
    for (let lon = -110; lon <= 110; lon += lonStep) {
      if (POLYS.some((p) => inside(lon, lat, p))) land.push({ lon, lat, ph: rand() * 6.28, warm: rand() < 0.09 })
      else if (rand() < 0.16) ocean.push({ lon, lat })
    }
  }
  return { land, ocean }
}

const toVec = (lon, lat) => [Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG)]
const fromVec = ([x, y, z]) => [Math.atan2(y, x) / DEG, Math.asin(Math.max(-1, Math.min(1, z))) / DEG]

function arc(a, b, n = 26) {
  const va = toVec(a.lon, a.lat)
  const vb = toVec(b.lon, b.lat)
  const dot = Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]))
  const om = Math.acos(dot)
  const pts = []
  for (let i = 0; i <= n; i += 1) {
    const t = i / n
    const s = Math.sin(om) || 1
    const k1 = Math.sin((1 - t) * om) / s
    const k2 = Math.sin(t * om) / s
    const v = [k1 * va[0] + k2 * vb[0], k1 * va[1] + k2 * vb[1], k1 * va[2] + k2 * vb[2]]
    const [lon, lat] = fromVec(v)
    pts.push({ lon, lat, lift: 0.16 * Math.sin(Math.PI * t) * Math.min(1, om / 0.6) })
  }
  return pts
}

export function DotGlobe({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const { land, ocean } = buildDots()
    const hub = CITIES[0]
    const links = CITIES.slice(1).map((c) => ({ to: c, pts: arc(hub, c) }))
    const rand = rng(7)
    const stars = Array.from({ length: 70 }, () => ({ x: rand(), y: rand(), r: rand() * 1.1 + 0.3, a: rand() * 0.5 + 0.15 }))
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let raf = 0

    const size = () => {
      const r = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const wide = w >= 900
      const cx = wide ? w * 0.66 : w * 0.5
      const cy = wide ? h * 0.5 : h * 0.3
      const R = Math.min(wide ? w * 0.36 : w * 0.62, wide ? h * 0.44 : h * 0.3)
      const lon0 = (-8 + (reduce ? 0 : 15 * Math.sin(t / 11000))) * DEG
      const lat0 = 13 * DEG
      const sl = Math.sin(lat0)
      const cl = Math.cos(lat0)

      const proj = (lon, lat, lift = 0) => {
        const p = lat * DEG
        const dl = lon * DEG - lon0
        const cp = Math.cos(p)
        const z = sl * Math.sin(p) + cl * cp * Math.cos(dl)
        const k = R * (1 + lift)
        return { x: cx + k * cp * Math.sin(dl), y: cy - k * (cl * Math.sin(p) - sl * cp * Math.cos(dl)), z }
      }

      // étoiles
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(190,225,240,${s.a})`
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, 6.283)
        ctx.fill()
      })

      // halo atmosphérique
      const halo = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35)
      halo.addColorStop(0, 'rgba(31,145,166,0.18)')
      halo.addColorStop(0.6, 'rgba(23,59,114,0.10)')
      halo.addColorStop(1, 'rgba(23,59,114,0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.35, 0, 6.283)
      ctx.fill()

      // disque de fond
      const disc = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R)
      disc.addColorStop(0, 'rgba(20,52,72,0.85)')
      disc.addColorStop(1, 'rgba(6,16,26,0.92)')
      ctx.fillStyle = disc
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 6.283)
      ctx.fill()

      // anneau de points en périphérie
      for (let i = 0; i < 320; i += 1) {
        const a = (i / 320) * 6.283
        const warm = 0.5 + 0.5 * Math.sin(a * 2 + 0.6)
        ctx.fillStyle = `rgba(${Math.round(90 + 150 * warm)},${Math.round(190 - 50 * warm)},${Math.round(235 - 150 * warm)},0.5)`
        ctx.beginPath()
        ctx.arc(cx + R * 1.012 * Math.cos(a), cy + R * 1.012 * Math.sin(a), 1.1, 0, 6.283)
        ctx.fill()
      }

      // océans (points très discrets)
      ctx.fillStyle = 'rgba(70,130,170,0.16)'
      ocean.forEach((d) => {
        const p = proj(d.lon, d.lat)
        if (p.z < 0.03) return
        ctx.fillRect(p.x - 0.6, p.y - 0.6, 1.2, 1.2)
      })

      // terres
      land.forEach((d) => {
        const p = proj(d.lon, d.lat)
        if (p.z < 0.03) return
        const tw = reduce ? 1 : 0.72 + 0.28 * Math.sin(t / 900 + d.ph)
        const a = (0.3 + 0.7 * Math.pow(p.z, 0.55)) * tw
        ctx.fillStyle = d.warm ? `rgba(255,152,84,${a})` : `rgba(102,206,234,${a * 0.9})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.8 + 0.95 * p.z, 0, 6.283)
        ctx.fill()
      })

      // arcs et paquets de données
      links.forEach((l, i) => {
        ctx.strokeStyle = 'rgba(120,215,238,0.32)'
        ctx.lineWidth = 1
        ctx.beginPath()
        let pen = false
        l.pts.forEach((q) => {
          const p = proj(q.lon, q.lat, q.lift)
          const vis = proj(q.lon, q.lat).z > 0.02
          if (!vis) {
            pen = false
            return
          }
          if (pen) ctx.lineTo(p.x, p.y)
          else ctx.moveTo(p.x, p.y)
          pen = true
        })
        ctx.stroke()

        if (!reduce) {
          const f = ((t / 5200 + i * 0.137) % 1) * (l.pts.length - 1)
          const q = l.pts[Math.floor(f)]
          const p = proj(q.lon, q.lat, q.lift)
          if (proj(q.lon, q.lat).z > 0.02) {
            ctx.fillStyle = 'rgba(255,196,140,0.95)'
            ctx.shadowColor = 'rgba(255,150,80,0.9)'
            ctx.shadowBlur = 8
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, 6.283)
            ctx.fill()
            ctx.shadowBlur = 0
          }
        }
      })

      // villes
      CITIES.forEach((c) => {
        const p = proj(c.lon, c.lat)
        if (p.z < 0.05) return
        if (c.hub) {
          const pulse = reduce ? 0.5 : (t % 2200) / 2200
          ctx.strokeStyle = `rgba(255,150,80,${0.55 * (1 - pulse)})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, 6 + 26 * pulse, 0, 6.283)
          ctx.stroke()
          ctx.fillStyle = '#ffb066'
          ctx.shadowColor = 'rgba(255,150,80,1)'
          ctx.shadowBlur = 16
          ctx.beginPath()
          ctx.arc(p.x, p.y, 4.5, 0, 6.283)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.fillStyle = 'rgba(255,236,214,0.95)'
          ctx.font = '500 13px Outfit, sans-serif'
          ctx.fillText(c.n, p.x + 12, p.y - 10)
        } else {
          ctx.fillStyle = 'rgba(190,240,250,0.95)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2.4, 0, 6.283)
          ctx.fill()
        }
      })
    }

    const loop = (t) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    size()
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => {
      size()
      if (reduce) draw(0)
    })
    ro.observe(canvas.parentElement)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
