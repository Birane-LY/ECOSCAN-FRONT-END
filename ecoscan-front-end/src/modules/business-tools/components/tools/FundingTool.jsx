'use client'

import React, { useMemo, useState } from 'react'
import { ArrowUpRight, Clock, ExternalLink, Landmark, Search } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { StatusChip } from '@/components/ui/StatusChip'

const GRANTS = [
  { name: 'Fonds DER', amount: '5 000 000 FCFA', rate: '80 %', deadline: '30 sept. 2026', eligible: true, criteria: 'PME de moins de 5 ans, secteur énergie' },
  { name: 'ANSUT Innovation', amount: '10 000 000 FCFA', rate: '50 %', deadline: '15 oct. 2026', eligible: false, criteria: 'Projet innovant avec impact environnemental' },
  { name: 'Programme Sénégal PME', amount: '2 500 000 FCFA', rate: '60 %', deadline: '04 nov. 2026', eligible: true, criteria: 'PME formalisée, plan de réduction carbone' },
]

export function FundingTool({ setDrawer }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return GRANTS.filter((g) => !q || `${g.name} ${g.criteria}`.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="fd">
      <label className="fd-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une opportunité"
          aria-label="Rechercher une opportunité de financement"
        />
      </label>

      {results.length === 0 && <p className="drawer-lead">Aucune opportunité ne correspond à « {query} ».</p>}

      <div className="fd-grid">
        {results.map((grant) => (
          <GlassCard as="article" className={`fd-card ${grant.eligible ? 'eligible' : ''}`} key={grant.name}>
            <div className="fd-top">
              <span className="fd-logo">
                <Landmark size={18} />
              </span>
              <StatusChip status={grant.eligible ? 'Éligible' : 'À vérifier'} />
            </div>
            <h3>{grant.name}</h3>
            <p>{grant.criteria}</p>
            <div className="fd-meta">
              <div>
                <span>Montant maximum</span>
                <strong>{grant.amount}</strong>
              </div>
              <div>
                <span>Financement</span>
                <strong>{grant.rate}</strong>
              </div>
            </div>
            <div className="fd-deadline">
              <Clock size={15} /> Dossier à déposer avant le {grant.deadline}
            </div>
            <div className="fd-actions">
              <button
                className={grant.eligible ? 'primary-button' : 'secondary-button'}
                onClick={() => setDrawer(`funding-${grant.name}`)}
              >
                {grant.eligible ? 'Voir le dossier' : 'Comprendre les critères'} <ArrowUpRight size={15} />
              </button>
              {grant.eligible && (
                <button className="icon-button" aria-label={`Ouvrir la candidature ${grant.name}`}>
                  <ExternalLink size={16} />
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
