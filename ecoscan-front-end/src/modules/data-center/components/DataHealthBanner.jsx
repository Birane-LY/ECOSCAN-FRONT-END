import React from 'react'
import { ShieldCheck } from 'lucide-react'

export function DataHealthBanner({ files = [] }) {
  const total = files.length
  const pretes = files.filter((f) => f.status === 'Prêt').length
  const qualitePct = total > 0 ? Math.round((pretes / total) * 100) : 0
  const totalLignes = files.reduce((sum, f) => sum + (Number(f.rows) || 0), 0)

  return (
    <section className="data-health">
      <div>
        <span className="health-icon"><ShieldCheck size={18} /></span>
        <div>
          <strong>{total > 0 ? `${total} source${total > 1 ? 's' : ''} importée${total > 1 ? 's' : ''}` : 'Aucune source pour le moment'}</strong>
          <span>{pretes} sur {total} prête{pretes > 1 ? 's' : ''} à l'analyse</span>
        </div>
      </div>
      <div className="health-stat"><b>{qualitePct}%</b><span>fichiers prêts</span></div>
      <div className="health-stat"><b>{totalLignes.toLocaleString('fr-FR')}</b><span>lignes cumulées</span></div>
    </section>
  )
}