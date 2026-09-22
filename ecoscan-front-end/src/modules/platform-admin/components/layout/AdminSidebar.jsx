'use client'

import React from 'react'
import { CircleDollarSign, LogOut, Send, X } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '../../constants'

function NavButton({ id, label, Icon, active, onClick }) {
  return (
    <button type="button" className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={() => onClick(id)}>
      <Icon size={17} />
      <span>{label}</span>
      {id === 'support' && <i>23</i>}
    </button>
  )
}

function NavGroup({ label, items, view, select }) {
  return (
    <div className="adm-group">
      <p>{label}</p>
      {items.map(([id, itemLabel, Icon]) => (
        <NavButton key={id} id={id} label={itemLabel} Icon={Icon} active={view === id} onClick={select} />
      ))}
    </div>
  )
}

export function AdminSidebar({ drawer, setDrawer, view, select }) {
  return (
    <aside className={`adm-side ${drawer ? 'open' : ''}`}>
      <div className="adm-brand">
        <span>EcoScan</span>
        <span className="chip">Admin</span>
        <button type="button" className="icon-button adm-close" onClick={() => setDrawer(false)} aria-label="Fermer le menu">
          <X size={18} />
        </button>
      </div>

      <div className="adm-context">
        <strong>EcoScan Platform</strong>
        <small>Console créateurs</small>
      </div>

      <nav className="adm-nav" aria-label="Navigation de la console">
        <NavGroup label="Plateforme" items={ADMIN_NAV_ITEMS.slice(0, 3)} view={view} select={select} />
        <NavGroup label="Pilotage" items={ADMIN_NAV_ITEMS.slice(3, 6)} view={view} select={select} />
        <NavGroup label="Opérations" items={ADMIN_NAV_ITEMS.slice(6)} view={view} select={select} />
        <div className="adm-group">
          <p>Revenus</p>
          <NavButton id="invoices" label="Factures mensuelles" Icon={CircleDollarSign} active={view === 'invoices'} onClick={select} />
          <NavButton id="reminders" label="Centre de relances" Icon={Send} active={view === 'reminders'} onClick={select} />
        </div>
      </nav>

      <div className="adm-side-bottom">
        <p className="adm-status">
          <i aria-hidden="true" />
          Tous les systèmes opérationnels
        </p>
        <div className="adm-profile">
          <span className="ad-avatar">CM</span>
          <div>
            <strong>Camille Martin</strong>
            <small>Super Admin</small>
          </div>
          <LogOut size={16} aria-hidden="true" />
        </div>
      </div>
    </aside>
  )
}
