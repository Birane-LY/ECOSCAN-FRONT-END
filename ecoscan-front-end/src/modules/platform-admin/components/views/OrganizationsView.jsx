'use client'

import React, { useState } from 'react'
import { Check, Download, Pencil, Plus, Search, Building2 } from 'lucide-react'
import { AdminHeading } from '@/modules/platform-admin/components/views/AdminHeading'

function filterOrganisations(orgs, q, filter) {
  const query = q.trim().toLowerCase()
  return orgs.filter((o) => {
    const matchQuery = !query || o.name.toLowerCase().includes(query) || (o.sector || '').toLowerCase().includes(query)
    const matchFilter = filter === 'Toutes' || o.status === filter
    return matchQuery && matchFilter
  })
}

export function OrganizationsView({
  organisations,
  loading,
  error,
  activer,
  suspendre,
  selectOrg,
  selectedOrg,
  openModal,
  notify,
}) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('Toutes')
  const [busyId, setBusyId] = useState(null)

  const visible = filterOrganisations(organisations, q, filter)

  const handleActiver = async (org) => {
    setBusyId(org.id)
    try {
      await activer(org.id)
      notify('Organisation activée')
      if (selectedOrg?.id === org.id) selectOrg(null)
    } catch (err) {
      notify(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleSuspendre = async (org) => {
    setBusyId(org.id)
    try {
      await suspendre(org.id)
      notify('Organisation suspendue')
      if (selectedOrg?.id === org.id) selectOrg(null)
    } catch (err) {
      notify(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <AdminHeading
        eyebrow="MULTI-TENANT MANAGEMENT"
        title="Organisations"
        subtitle="Validez, accompagnez et administrez les espaces clients."
        action={
          <button className="admin-primary" onClick={() => openModal('org')}>
            <Plus size={14} />
            Créer
          </button>
        }
      />

      <div className="admin-toolbar">
        <label className="admin-filter">
          <Search size={15} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par nom, secteur..."
          />
        </label>
        <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Toutes</option>
          <option>À valider</option>
          <option>Actif</option>
          <option>Suspendu</option>
        </select>
        <button
          className="admin-secondary"
          onClick={() => notify('Export CSV — disponible sous peu')}
        >
          <Download size={14} />
          Exporter
        </button>
      </div>

      {loading && <p className="admin-state-message">Chargement des organisations…</p>}
      {error && <p className="admin-state-message error">Erreur : {error}</p>}

      {!loading && !error && (
        <article className="admin-panel">
          <div className="admin-table org-table">
            <div className="admin-row admin-head">
              <span>Organisation</span>
              <span>Secteur</span>
              <span>Localisation</span>
              <span>Utilisateurs</span>
              <span>Statut</span>
              <span className="text-right">Actions</span>
            </div>
            {visible.map((o) => (
              <div className="admin-row" key={o.id}>
                <button className="row-link" onClick={() => selectOrg(o)}>
                  <Building2 size={15} className="row-icon" />
                  <b>{o.name}</b>
                </button>
                <span>{o.sector}</span>
                <span>{o.location}</span>
                <span>{o.users}</span>
                <div>
                  <span
                    className={`status-chip ${
                      o.status === 'Actif'
                        ? 'active'
                        : o.status === 'À valider'
                        ? 'warning'
                        : 'suspended'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="row-actions text-right">
                  <button
                    className="row-action icon-only"
                    onClick={() => openModal('org', o)}
                    aria-label="Modifier"
                    title="Modifier"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="row-action text-btn"
                    disabled={busyId === o.id}
                    onClick={() => (o.statusRaw === 'ACTIVE' ? handleSuspendre(o) : handleActiver(o))}
                  >
                    {busyId === o.id ? '…' : o.statusRaw === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                  </button>
                </div>
              </div>
            ))}
            {visible.length === 0 && (
              <div className="admin-empty-table">
                Aucune organisation ne correspond aux critères.
              </div>
            )}
          </div>
        </article>
      )}

      {selectedOrg && (
        <article className="admin-inline-detail">
          <div>
            <small className="eyebrow">ORGANISATION SÉLECTIONNÉE</small>
            <h3>{selectedOrg.name}</h3>
            <span>
              {selectedOrg.location} · {selectedOrg.users} utilisateur{selectedOrg.users > 1 ? 's' : ''} ·{' '}
              {selectedOrg.sector}
            </span>
          </div>
          <div className="inline-actions">
            {selectedOrg.statusRaw !== 'ACTIVE' && (
              <button className="admin-primary" disabled={busyId === selectedOrg.id} onClick={() => handleActiver(selectedOrg)}>
                <Check size={14} />
                {selectedOrg.statusRaw === 'EN_ATTENTE' ? 'Approuver' : 'Activer'}
              </button>
            )}
            {selectedOrg.statusRaw !== 'SUSPENDUE' && (
              <button className="admin-danger" disabled={busyId === selectedOrg.id} onClick={() => handleSuspendre(selectedOrg)}>
                Suspendre
              </button>
            )}
          </div>
        </article>
      )}
    </>
  )
}