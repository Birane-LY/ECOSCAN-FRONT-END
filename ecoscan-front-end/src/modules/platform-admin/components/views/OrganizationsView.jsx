"use client";

import React, { useState } from "react";
import { Check, Download, Pencil, Plus, Search } from "lucide-react";
import { GlassCard } from "@/components/instruments";
import { AdminHeading } from "./AdminHeading";
import { statusTone } from "./adminUi";
import {apiClient} from "@/lib/apiClient";

// Fonction utilitaire pour normaliser une organisation Django vers les props React
function mapDjangoOrg(o) {
  if (!o) return null;

  // Mappage des statuts Django ("EN_ATTENTE", "ACTIVE", "SUSPENDUE") vers le UI React
  let formattedStatus = "Actif";
  if (o.statut === "EN_ATTENTE" || o.status === "EN_ATTENTE")
    formattedStatus = "À valider";
  else if (o.statut === "SUSPENDUE" || o.status === "SUSPENDUE")
    formattedStatus = "Suspendu";
  else if (o.statut === "ACTIVE" || o.status === "ACTIVE")
    formattedStatus = "Actif";
  else if (o.status) formattedStatus = o.status;

  return {
    id: o.id,
    name: o.nom || o.name || "Sans nom",
    sector: o.secteur || o.sector || "-",
    // Le serializer Django n'a pas de champ "email" sur l'organisation elle-même
    // (une organisation peut avoir plusieurs admins) : il renvoie emails_admin,
    // la liste des emails des ADMIN_ORGANISATION de la structure.
    email: (o.emails_admin && o.emails_admin[0]) || o.email || "",
    plan: o.type_compte || o.plan || "Pro",
    users_count: o.nombre_membres ?? o.membres_count ?? o.users_count ?? o.users ?? 1,
    status: formattedStatus,
    rawStatut: o.statut,
    rawOrg: o,
  };
}

export function OrganizationsView({
  orgs = [],
  setOrgs,
  selectOrg,
  selectedOrg,
  openModal,
  notify,
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Toutes");

// Filtrage et mapping sécurisés
  const mappedOrgs = (Array.isArray(orgs) ? orgs : [])
    .map(mapDjangoOrg)
    .filter(Boolean);

  // Filtrage local
  const visible = mappedOrgs.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(q.toLowerCase()) ||
      o.sector.toLowerCase().includes(q.toLowerCase());

    if (filter === "Toutes") return matchesSearch;
    return matchesSearch && o.status === filter;
  });

  // Inversion du statut (Actif / Suspendu) avec l'URL Django `/organisations/structures/`
  const toggleStatus = async (org) => {
    // Statuts Django attendus par la méthode update() de Django: "ACTIVE" ou "SUSPENDUE"
    const isCurrentlyActive = org.status === "Actif";
    const nextDjangoStatus = isCurrentlyActive ? "SUSPENDUE" : "ACTIVE";

    try {
      // Endpoint : /organisations/structures/ (l'app organizations est montée sous /api/organisations/, voir API_PREFIX dans apiClient.js)
      const res = await apiClient.patch(`/organisations/structures/${org.id}/`, {
        statut: nextDjangoStatus,
      });

      const updatedOrg = mapDjangoOrg(res.data);
      setOrgs(orgs.map((x) => (x.id === org.id ? { ...x, ...res.data } : x)));
      notify(`Statut mis à jour : ${updatedOrg.status}`);
    } catch (err) {
      notify(
        "Erreur lors du changement de statut (droits insuffisants ou défaut de paiement)",
      );
    }
  };

  // Action explicite d'approbation ou suspension depuis la carte détaillée
  const updateOrgStatus = async (orgId, targetStatus) => {
    const djangoStatus = targetStatus === "Actif" ? "ACTIVE" : "SUSPENDUE";
    try {
      const res = await apiClient.patch(`/organisations/structures/${orgId}/`, {
        statut: djangoStatus,
      });
      setOrgs(orgs.map((o) => (o.id === orgId ? { ...o, ...res.data } : o)));
      selectOrg(null);
      notify(
        `Organisation ${targetStatus === "Actif" ? "approuvée" : "suspendue"}`,
      );
    } catch {
      notify("Erreur lors de la mise à jour de l’organisation");
    }
  };

  const selectedMapped = selectedOrg ? mapDjangoOrg(selectedOrg) : null;

  return (
    <>
      <AdminHeading
        title="Organisations"
        subtitle="Validez, accompagnez et administrez les espaces clients."
        action={
          <button className="primary-button" onClick={() => openModal("org")}>
            <Plus size={16} />
            Créer
          </button>
        }
      />

      <div className="adm-toolbar">
        <label className="fd-search">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nom, secteur…"
            aria-label="Rechercher une organisation"
          />
        </label>
        <select
          className="st-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filtrer par statut"
        >
          <option>Toutes</option>
          <option>À valider</option>
          <option>Actif</option>
          <option>Suspendu</option>
        </select>
        <button
          type="button"
          className="secondary-button"
          onClick={() => notify("Export CSV préparé")}
        >
          <Download size={16} />
          Exporter
        </button>
      </div>

      <GlassCard as="article" className="adm-panel adm-table-wrap">
        <div
          className="adm-table"
          style={{ "--cols": "1.6fr 1fr 0.8fr 0.8fr 1fr 1.2fr" }}
        >
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
              <button
                type="button"
                className="adm-row-link"
                onClick={() => selectOrg(o.rawOrg || o)}
              >
                <strong>{o.name}</strong>
                {o.email && <small>{o.email}</small>}
              </button>
              <span>{o.sector}</span>
              <span>{o.plan}</span>
              <span>{o.users_count}</span>
              <span className={`chip ${statusTone(o.status)}`}>{o.status}</span>
              <span className="adm-row-actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => openModal("org", o.rawOrg || o)}
                  aria-label={`Modifier ${o.name}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => toggleStatus(o)}
                >
                  {o.status === "Actif" ? "Suspendre" : "Activer"}
                </button>
              </span>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="drawer-lead" style={{ padding: "1rem" }}>
              Aucune organisation ne correspond à ces filtres.
            </p>
          )}
        </div>
      </GlassCard>

      {selectedMapped && (
        <GlassCard as="article" tone="inverse" className="adm-inline">
          <div>
            <span className="hc-label">Organisation sélectionnée</span>
            <h3>{selectedMapped.name}</h3>
            <span className="hc-sub">
              Secteur : {selectedMapped.sector} | Plan : {selectedMapped.plan}
            </span>
          </div>
          <div className="adm-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => updateOrgStatus(selectedMapped.id, "Actif")}
            >
              <Check size={16} />
              Approuver
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => updateOrgStatus(selectedMapped.id, "Suspendu")}
            >
              Suspendre
            </button>
          </div>
        </GlassCard>
      )}
    </>
  );
}