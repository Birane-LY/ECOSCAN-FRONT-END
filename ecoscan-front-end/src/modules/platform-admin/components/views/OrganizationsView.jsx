'use client'

import React, { useState } from 'react'
import { Check, Download, Pencil, Plus, Search } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { AdminHeading } from './AdminHeading'
import { statusTone } from './adminUi'
import { filterOrganizations } from '../../services/adminServices'

export function OrganizationsView({ orgs, setOrgs, selectOrg, selectedOrg, openModal, notify }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('Toutes')
  const visible = filterOrganizations(orgs, q, filter)

  return (
    <>
      <AdminHeading
        title="Organisations"
        subtitle="Validez, accompagnez et administrez les espaces clients."
        action={
          <button className="primary-button" onClick={() => openModal('org')}>
            <Plus size={16} />
            Créer
          </button>
        }
      />

      <div className="adm-toolbar">
        <label className="fd-search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, secteur…" aria-label="Rechercher une organisation" />
        </label>
        <select className="st-select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrer par statut">
          <option>Toutes</option>
          <option>À valider</option>
          <option>Actif</option>
          <option>Suspendu</option>
        </select>
        <button type="button" className="secondary-button" onClick={() => notify('Export CSV préparé')}>
          <Download size={16} />
          Exporter
        </button>
      </div>

      <GlassCard as="article" className="adm-panel adm-table-wrap">
        <div className="adm-table" style={{ '--cols': '1.6fr 1fr 0.8fr 0.8fr 1fr 1.2fr' }}>
          <div className="adm-row adm-head">
            <span>Organisation</span>
            <span>Secteur</span>
            <span>Plan</span>
            <span>Utilisateurs</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>
          {visible.map((o) => (
            <div className="adm-row" key={o.id}>
              <button type="button" className="adm-row-link" onClick={() => selectOrg(o)}>
                <strong>{o.name}</strong>
                <small>{o.email}</small>
              </button>
              <span>{o.sector}</span>
              <span>{o.plan}</span>
              <span>{o.users}</span>
              <span className={`chip ${statusTone(o.status)}`}>{o.status}</span>
              <span className="adm-row-actions">
                <button type="button" className="icon-button" onClick={() => openModal('org', o)} aria-label={`Modifier ${o.name}`}>
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setOrgs(orgs.map((x) => (x.id === o.id ? { ...x, status: x.status === 'Actif' ? 'Suspendu' : 'Actif' } : x)))
                    notify('Statut mis à jour')
                  }}
                >
                  {o.status === 'Actif' ? 'Suspendre' : 'Activer'}
                </button>
              </span>
            </div>
          ))}
          {visible.length === 0 && <p className="drawer-lead">Aucune organisation ne correspond à ces filtres.</p>}
        </div>
      </GlassCard>

      {selectedOrg && (
        <GlassCard as="article" tone="inverse" className="adm-inline">
          <div>
            <span className="hc-label">Organisation sélectionnée</span>
            <h3>{selectedOrg.name}</h3>
            <span className="hc-sub">
              {selectedOrg.email}, {selectedOrg.users} utilisateurs, {selectedOrg.plan}
            </span>
          </div>
          <div className="adm-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setOrgs(orgs.map((o) => (o.id === selectedOrg.id ? { ...o, status: 'Actif' } : o)))
                selectOrg(null)
                notify('Organisation approuvée')
              }}
            >
              <Check size={16} />
              Approuver
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setOrgs(orgs.map((o) => (o.id === selectedOrg.id ? { ...o, status: 'Suspendu' } : o)))
                selectOrg(null)
                notify('Organisation suspendue')
              }}
            >
              Suspendre
            </button>
          </div>
        </GlassCard>
      )}
    </>
  )
}
