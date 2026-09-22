#!/usr/bin/env node
/**
 * Audit du CSS historique (globals.css).
 *
 * Trouve les règles dont AU MOINS UNE classe n'apparaît dans aucun fichier source,
 * donc qui ne peuvent plus s'appliquer, et écrit une copie élaguée SANS toucher à l'original.
 *
 * Usage (à lancer à la racine du projet, avec TOUT le code : cockpit, /admin, onboarding…) :
 *   node scripts/audit-legacy-css.mjs
 *   node scripts/audit-legacy-css.mjs --css src/app/globals.css --src src --out globals.pruned.css
 *   node scripts/audit-legacy-css.mjs --keep admin-,plan-,service-   # préfixes à conserver quoi qu'il arrive
 *
 * Prudence : une classe construite dynamiquement (`btn-${x}`) est protégée par son préfixe,
 * mais vérifiez le rapport avant de remplacer globals.css, puis testez chaque écran.
 */
import fs from 'node:fs'
import path from 'node:path'

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : def
}
const cssPath = arg('css', 'src/app/globals.css')
const srcDir = arg('src', 'src')
const outPath = arg('out', 'globals.pruned.css')
const keepPrefixes = (arg('keep', '') || '').split(',').filter(Boolean)

// 1. Classes utilisées dans le code
const tokens = new Set()
const dynamicPrefixes = new Set()
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(jsx?|tsx?|mdx?|html)$/.test(e.name)) {
      const text = fs.readFileSync(p, 'utf8')
      for (const m of text.matchAll(/[A-Za-z_][\w-]*/g)) tokens.add(m[0])
      for (const m of text.matchAll(/([A-Za-z][\w-]*-)\$\{/g)) dynamicPrefixes.add(m[1])
    }
  }
}
walk(srcDir)
const isUsed = (cls) =>
  tokens.has(cls) ||
  keepPrefixes.some((p) => cls.startsWith(p)) ||
  [...dynamicPrefixes].some((p) => cls.startsWith(p))

// 2. Analyse du CSS
const css = fs.readFileSync(cssPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

function splitTop(str, sep) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of str) {
    if (ch === '(' || ch === '[') depth += 1
    if (ch === ')' || ch === ']') depth -= 1
    if (ch === sep && depth === 0) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur)
  return out
}

function parse(text) {
  const nodes = []
  let i = 0
  let prelude = ''
  while (i < text.length) {
    const ch = text[i]
    if (ch === ';') {
      nodes.push({ type: 'stmt', text: `${prelude.trim()};` })
      prelude = ''
      i += 1
    } else if (ch === '{') {
      let depth = 1
      let j = i + 1
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth += 1
        if (text[j] === '}') depth -= 1
        j += 1
      }
      const body = text.slice(i + 1, j - 1)
      const head = prelude.trim()
      if (/^@(media|supports|layer)/.test(head)) nodes.push({ type: 'group', head, children: parse(body) })
      else if (head.startsWith('@')) nodes.push({ type: 'at', head, body })
      else nodes.push({ type: 'rule', selectors: splitTop(head, ',').map((s) => s.trim()).filter(Boolean), body })
      prelude = ''
      i = j
    } else {
      prelude += ch
      i += 1
    }
  }
  return nodes
}

const stats = { rules: 0, removed: 0, deadClasses: new Map() }

function prune(nodes) {
  const out = []
  for (const n of nodes) {
    if (n.type === 'group') {
      const children = prune(n.children)
      if (children.length) out.push({ ...n, children })
    } else if (n.type === 'rule') {
      stats.rules += 1
      const live = n.selectors.filter((sel) => {
        const classes = [...sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1])
        const dead = classes.filter((c) => !isUsed(c))
        dead.forEach((c) => stats.deadClasses.set(c, (stats.deadClasses.get(c) || 0) + 1))
        return dead.length === 0
      })
      if (live.length) out.push({ ...n, selectors: live })
      else stats.removed += 1
    } else out.push(n)
  }
  return out
}

const print = (nodes) =>
  nodes
    .map((n) => {
      if (n.type === 'stmt') return n.text
      if (n.type === 'at') return `${n.head} {${n.body}}`
      if (n.type === 'group') return `${n.head} {\n${print(n.children)}\n}`
      return `${n.selectors.join(',\n')} {${n.body}}`
    })
    .join('\n')

const pruned = prune(parse(css))
let result = print(pruned)

// Keyframes jamais référencées
const keyframes = [...result.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1])
const outside = (name) => new RegExp(`animation[^;{}]*\\b${name}\\b`).test(result)
keyframes.filter((k) => !outside(k)).forEach((k) => {
  result = result.replace(new RegExp(`@keyframes\\s+${k}\\s*\\{(?:[^{}]*\\{[^{}]*\\})*[^{}]*\\}`, 'g'), '')
})

fs.writeFileSync(outPath, `${result.replace(/\n{3,}/g, '\n\n').trim()}\n`)

const before = Buffer.byteLength(css)
const after = Buffer.byteLength(result)
console.log(`Règles analysées : ${stats.rules}`)
console.log(`Règles supprimables : ${stats.removed} (${Math.round((stats.removed / Math.max(1, stats.rules)) * 100)} %)`)
console.log(`Taille : ${(before / 1024).toFixed(0)} Ko -> ${(after / 1024).toFixed(0)} Ko`)
const top = [...stats.deadClasses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)
console.log('\nClasses inutilisées les plus fréquentes :')
top.forEach(([c, n]) => console.log(`  .${c}  (${n} règle${n > 1 ? 's' : ''})`))
console.log(`\nCopie élaguée écrite dans ${outPath} (l'original n'est pas modifié).`)
