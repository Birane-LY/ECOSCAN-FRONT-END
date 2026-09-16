"use client";

import React from "react";
import {
  ChevronDown,
  Check,
  CloudUpload,
  Gauge,
  LogOut,
  Settings2,
  Sparkles,
  TrendingDown,
  FileSpreadsheet,
  Target,
  Wrench,
  X,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { ROLE_PROFILES } from "@/modules/auth/constants";

const PRIMARY_NAV = [
  { id: "overview", label: "Vue d’ensemble", icon: Gauge },
  { id: "analyses", label: "Analyses", icon: TrendingDown },
  { id: "data", label: "Données", icon: FileSpreadsheet },
  { id: "goals", label: "Objectifs", icon: Target },
];

export function Sidebar({
  mobileNav, setMobileNav, view, go, openUpload, activeRole, currentProfile,
  organisations = [], activeOrganisation, onSwitchOrganisation, onLogout,
}) {
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false)
  const profile = currentProfile || ROLE_PROFILES[activeRole] || ROLE_PROFILES.UTILISATEUR_ORGANISATION
  const orgName = activeOrganisation?.nom || 'Organisation'

  return (
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand-row">
        <img
          className="ecoscan-logo"
          src={APP_CONFIG.logoUrl}
          alt={APP_CONFIG.appName}
        />
        <span>{APP_CONFIG.appName}</span>
        <button
          className="icon-button mobile-close lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMobileNav(false)}
        >
          <X />
        </button>
      </div>

      {/* Zone scrollable : tout ce qui peut dépasser sur mobile passe ici */}
      <div className="sidebar-scroll">
        <button className="workspace-switcher" onClick={() => setWorkspaceOpen((v) => !v)}>
          <div className="workspace-avatar">{orgName[0]?.toUpperCase() || 'O'}</div>
          <div><strong>{orgName}</strong><span>{profile.label}</span></div>
          <ChevronDown size={15} />
        </button>

        {workspaceOpen && organisations.length > 0 && (
          <div className="workspace-menu">
            {organisations.map((org) => (
              <button key={org.id} onClick={() => { onSwitchOrganisation(org.id); setWorkspaceOpen(false) }}>
                <span className="workspace-avatar small">{org.nom[0]?.toUpperCase()}</span>
                {org.nom}
                {activeOrganisation?.id === org.id && <Check size={14} />}
              </button>
            ))}
          </div>
        )}

        <nav aria-label="Navigation principale">
          <p className="nav-caption">PILOTAGE</p>
          {PRIMARY_NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() => go(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
              {id === "analyses" && <span className="nav-count">4</span>}
            </button>
          ))}

          <p className="nav-caption nav-caption-spaced">ESPACE DE TRAVAIL</p>
          <button
            className={`nav-item ${view === "assistant" ? "active" : ""}`}
            onClick={() => go("assistant")}
          >
            <Sparkles size={17} />
            <span>Assistant IA</span>
            <span className="new-pill">Bêta</span>
          </button>
          <button
            className={`nav-item ${view === "features" ? "active" : ""}`}
            onClick={() => go("features")}
          >
            <Wrench size={17} />
            <span>Outils métier</span>
            <span className="new-pill">Nouveau</span>
          </button>
          <button className="nav-item" onClick={openUpload}>
            <CloudUpload size={17} />
            <span>Importer</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button
          className={`nav-item ${view === "settings" ? "active" : ""}`}
          onClick={() => go("settings")}
        >
          <Settings2 size={17} />
          <span>Paramètres</span>
        </button>

        <div className="profile">
          <div className="profile-avatar">{profile.initials}</div>
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.label}</span>
          </div>
          <button
            className="icon-button"
            aria-label="Se déconnecter"
            onClick={onLogout}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}