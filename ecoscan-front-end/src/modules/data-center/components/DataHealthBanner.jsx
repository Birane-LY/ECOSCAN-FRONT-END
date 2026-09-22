import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { TickProgress } from '@/components/instruments'

export function DataHealthBanner({ files = [] }) {
  const total = files.length
  const pretes = files.filter((f) => f.status === 'Prêt').length
  const pct = total > 0 ? Math.round((pretes / total) * 100) : 0
  const lignes = files.reduce((sum, f) => sum + (Number(f.rows) || 0), 0)

  return (
    <section className="dc-health glass">
      <div className="dc-health-main">
        <span className="dc-health-icon">
          <ShieldCheck size={20} />
        </span>
        <div>
          <strong>
            {total > 0 ? `${total} source${total > 1 ? 's' : ''} importée${total > 1 ? 's' : ''}` : 'Aucune source pour le moment'}
          </strong>
          <span>
            {pretes} sur {total} prête{pretes > 1 ? 's' : ''} à l’analyse
          </span>
        </div>
      </div>
      <div className="dc-health-stat">
        <span>Fichiers prêts</span>
        <strong>{pct} %</strong>
        <TickProgress value={pct} ticks={20} label="Part de fichiers prêts" />
      </div>
      <div className="dc-health-stat">
        <span>Lignes cumulées</span>
        <strong>{lignes.toLocaleString('fr-FR')}</strong>
      </div>
    </section>
  )
}
