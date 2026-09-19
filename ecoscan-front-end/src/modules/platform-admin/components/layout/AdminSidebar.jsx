'use client'

import React from 'react'
import { LayoutDashboard, Building2, CreditCard, Users, HelpCircle, Activity, ShieldCheck, ArrowUpRight, X } from 'lucide-react'
import Link from 'next/link'

export function AdminSidebar({ drawer, setDrawer, view, select }) {
  const navGroups = [
    {
      title: 'GESTION PLATEFORME',
      items: [
        { id: 'dashboard', label: 'Aperçu global', icon: LayoutDashboard },
        { id: 'organizations', label: 'Organisations', icon: Building2 },
        { id: 'billing', label: 'Offres & Subscriptions', icon: CreditCard },
      ],
    },
    {
      title: 'EXPLOITATION & SUPPORT',
      items: [
        { id: 'users', label: 'Utilisateurs client', icon: Users },
        { id: 'support', label: 'Support & Tickets', icon: HelpCircle },
        { id: 'system', label: 'Santé système', icon: Activity },
      ],
    },
    {
      title: 'GOUVERNANCE',
      items: [
        { id: 'team', label: 'Équipe EcoScan', icon: ShieldCheck },
      ],
    },
  ]

  return (
    <aside className={`admin-sidebar ${drawer ? 'open' : ''}`}>
      <div className="admin-brand">
        <span className="admin-brand-mark">E</span>
        <strong>EcoScan</strong>
        <span className="admin-badge">SUPERADMIN</span>
        <button className="admin-mobile-close icon-button" onClick={() => setDrawer(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="admin-context">
        <div className="admin-context-icon">HQ</div>
        <div>
          <strong>Console Centralisée</strong>
          <span>Multi-tenant Operations</span>
        </div>
      </div>

      <nav className="admin-nav">
        {navGroups.map((group) => (
          <div key={group.title} className="admin-nav-group">
            <p>{group.title}</p>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = view === item.id
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => select(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="system-pill">
          <span />
          <div>
            <strong>Système Opérationnel</strong>
            <small>Tous les services sont au vert</small>
          </div>
        </div>

        <Link href="/dashboard" className="platform-console-link">
          <span>
            <strong>Retour au Cockpit</strong>
            <small>Vue Organisation client</small>
          </span>
          <ArrowUpRight size={14} />
        </Link>

        <div className="admin-profile">
          <span>CM</span>
          <div>
            <strong>Camille Martin</strong>
            <small>Super Administrator</small>
          </div>
        </div>
      </div>
    </aside>
  )
}