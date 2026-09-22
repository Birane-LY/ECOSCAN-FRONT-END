import React from 'react'

/** En-tête de page. `eyebrow` est accepté pour compatibilité mais n'est plus affiché :
 *  le titre suffit, la navigation indique déjà où l'on est. */
export function PageHeader({ title, subtitle, action }) {
  return (
    <section className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {action}
    </section>
  )
}
