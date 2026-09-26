'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

export function PlanModal({ initial, onSubmit }) {
  const [d, setD] = useState(() => ({
    code: initial?.code || '',
    nom: initial?.nom || '',
    description: initial?.description || '',
    prix_mensuel: initial?.prix_mensuel ?? '',
    prix_annuel: initial?.prix_annuel ?? '',
    devise: initial?.devise || 'XOF',
    seats: initial?.limites?.utilisateurs ?? '',
    actif: initial?.actif ?? true,
    fonctionnalites: initial?.fonctionnalites || {},
    avantages: Array.isArray(initial?.fonctionnalites?.avantages)
      ? initial.fonctionnalites.avantages.join('\n')
      : '',
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalizedSeats = String(d.seats).trim()
    onSubmit({
      code: d.code.trim().toLowerCase(),
      nom: d.nom.trim(),
      description: d.description.trim(),
      prix_mensuel: d.prix_mensuel,
      prix_annuel: d.prix_annuel === '' ? null : d.prix_annuel,
      devise: d.devise,
      limites: {
        ...(initial?.limites || {}),
        utilisateurs: normalizedSeats ? Number(normalizedSeats) : null,
      },
      fonctionnalites: {
        ...d.fonctionnalites,
        avantages: d.avantages
          .split('\n')
          .map((advantage) => advantage.trim())
          .filter(Boolean),
      },
      actif: d.actif,
    })
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {[
        ['code', 'Code unique du plan'],
        ['nom', 'Nom du plan'],
        ['prix_mensuel', 'Prix mensuel (FCFA)'],
        ['prix_annuel', 'Prix annuel (FCFA, facultatif)'],
        ['seats', 'Limite d’utilisateurs (laisser vide pour illimité)'],
      ].map(([k, l]) => (
        <label key={k} className="fld span-2">
          {l}
          <input
            required={k !== 'prix_annuel' && k !== 'seats'}
            type={k.startsWith('prix_') || k === 'seats' ? 'number' : 'text'}
            min={k.startsWith('prix_') || k === 'seats' ? '0' : undefined}
            step={k.startsWith('prix_') ? '0.01' : undefined}
            value={d[k] ?? ''}
            onChange={(e) => setD({ ...d, [k]: e.target.value })}
          />
        </label>
      ))}
      <p className="span-2 text-xs text-[var(--ink-3)]">
        Le prix mensuel est requis. Le tarif annuel, s’il est renseigné, sera aussi affiché sur le site vitrine.
      </p>
      <label className="fld span-2">
        Description de la formule
        <textarea
          rows={4}
          maxLength={500}
          placeholder="À qui s’adresse cette formule et quelle valeur apporte-t-elle ?"
          value={d.description}
          onChange={(e) => setD({ ...d, description: e.target.value })}
        />
      </label>
      <label className="fld span-2">
        Avantages et fonctionnalités
        <textarea
          rows={6}
          placeholder={'Une fonctionnalité par ligne, par exemple :\nSuivi de la consommation\nAnalyse des factures\nRapports personnalisés'}
          value={d.avantages}
          onChange={(e) => setD({ ...d, avantages: e.target.value })}
        />
        <small className="text-[var(--ink-3)]">
          Chaque ligne devient un avantage distinct sur la carte publique.
        </small>
      </label>
      {[
        ['analytics_avances', 'Analytics avancés'],
        ['support_prioritaire', 'Support prioritaire'],
      ].map(([key, label]) => (
        <label className="adm-check span-2" key={key}>
          <input
            type="checkbox"
            checked={Boolean(d.fonctionnalites[key])}
            onChange={(e) => setD({
              ...d,
              fonctionnalites: { ...d.fonctionnalites, [key]: e.target.checked },
            })}
          />
          {label}
        </label>
      ))}
      <label className="adm-check span-2">
        <input
          type="checkbox"
          checked={d.actif}
          onChange={(e) => setD({ ...d, actif: e.target.checked })}
        />
        Publier cette formule sur le site vitrine
      </label>
      <button className="primary-button span-2" type="submit">
        <Check size={16} />
        Enregistrer le plan
      </button>
    </form>
  )
}
