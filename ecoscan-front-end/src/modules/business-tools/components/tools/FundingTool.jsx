import React from 'react'
import { ArrowUpRight, ChevronDown, Clock, ExternalLink, Filter, Landmark, Search } from 'lucide-react'

const GRANTS = [
  {
    name: 'Fonds DER',
    amount: '5 000 000 FCFA',
    rate: '80%',
    deadline: '30 sept. 2026',
    eligible: true,
    criteria: 'PME de moins de 5 ans · secteur énergie',
  },
  {
    name: 'ANSUT Innovation',
    amount: '10 000 000 FCFA',
    rate: '50%',
    deadline: '15 oct. 2026',
    eligible: false,
    criteria: 'Projet innovant avec impact environnemental',
  },
  {
    name: 'Programme Sénégal PME',
    amount: '2 500 000 FCFA',
    rate: '60%',
    deadline: '04 nov. 2026',
    eligible: true,
    criteria: 'PME formalisée · plan de réduction carbone',
  },
]

export function FundingTool({ setDrawer }) {
  return (
    <section className="funding-tool">
      <div className="funding-toolbar">
        <div className="search-field">
          <Search size={15} />
          <input placeholder="Rechercher une opportunité" />
        </div>
        <button className="quiet-button"><Filter size={14} />Secteur · Tous</button>
        <button className="quiet-button">Trier par deadline <ChevronDown size={14} /></button>
      </div>

      <div className="funding-grid">
        {GRANTS.map((grant) => (
          <article className={`funding-card ${grant.eligible ? 'eligible' : 'ineligible'}`} key={grant.name}>
            <div className="funding-card-top">
              <span className="funding-logo"><Landmark size={17} /></span>
              <span className={`status-chip ${grant.eligible ? 'ready' : ''}`}>
                {grant.eligible ? 'Éligible' : 'À vérifier'}
              </span>
            </div>
            <h3>{grant.name}</h3>
            <p>{grant.criteria}</p>
            <div className="funding-meta">
              <div><span>Montant max.</span><strong>{grant.amount}</strong></div>
              <div><span>Financement</span><strong>{grant.rate}</strong></div>
            </div>
            <div className="funding-deadline">
              <Clock size={14} />Dossier à déposer avant le {grant.deadline}
            </div>
            <div className="funding-actions">
              <button
                className={grant.eligible ? 'primary-button' : 'secondary-button'}
                onClick={() => setDrawer(`funding-${grant.name}`)}
              >
                {grant.eligible ? 'Voir le dossier' : 'Comprendre les critères'} <ArrowUpRight size={14} />
              </button>
              {grant.eligible && (
                <button className="icon-button" aria-label="Ouvrir le lien de candidature">
                  <ExternalLink size={15} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
