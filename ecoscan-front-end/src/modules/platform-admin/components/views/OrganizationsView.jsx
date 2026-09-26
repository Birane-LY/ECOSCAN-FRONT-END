"use client";

import React, { useState } from "react";
import { Check, Download, Search } from "lucide-react";
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
    plan: o.details_demande?.plan_nom || o.plan || "Non renseignée",
    users_count: o.nombre_membres ?? o.membres_count ?? o.users_count ?? o.users ?? 1,
    status: formattedStatus,
    rawStatut: o.statut,
    localisation: o.localisation || "",
    detailsDemande: o.details_demande || null,
    rawOrg: o,
  };
}

export function OrganizationsView({
  orgs = [],
  setOrgs,
  selectOrg,
  selectedOrg,
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
    return updateOrgStatus(
      org.id,
      org.status === "Actif" ? "Suspendu" : "Actif",
      org.rawStatut === "EN_ATTENTE",
    );
  };

  // Action explicite d'approbation ou suspension depuis la carte détaillée
  const updateOrgStatus = async (orgId, targetStatus, isApproval = false) => {
    const djangoStatus = targetStatus === "Actif" ? "ACTIVE" : "SUSPENDUE";
    try {
      const res = await apiClient.patch(`/organisations/structures/${orgId}/`, {
        statut: djangoStatus,
      });
      setOrgs(orgs.map((o) => (o.id === orgId ? { ...o, ...res.data } : o)));
      selectOrg(null);
      if (isApproval && res.data.activation_email_sent) {
        notify("Demande approuvée : l’e-mail d’activation a été envoyé par Brevo.");
      } else if (isApproval) {
        notify("Demande approuvée. Aucun compte administrateur en attente d’activation n’est lié.");
      } else {
        notify(`Organisation ${targetStatus === "Actif" ? "réactivée" : "suspendue"}`);
      }
    } catch (err) {
      notify(err.message || "Erreur lors de la mise à jour de l’organisation");
    }
  };

  const selectedMapped = selectedOrg ? mapDjangoOrg(selectedOrg) : null;

  return (
    <>
      <AdminHeading
        title="Organisations"
        subtitle="Validez, accompagnez et administrez les espaces clients."
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
                  className="secondary-button"
                  onClick={() => toggleStatus(o)}
                  disabled={o.status === "À valider" && !o.email}
                  title={o.status === "À valider" ? "Approuver et envoyer le lien d’activation" : undefined}
                >
                  {o.status === "Actif" ? "Suspendre" : o.status === "À valider" ? "Approuver" : "Activer"}
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
              {selectedMapped.localisation && ` | Localisation : ${selectedMapped.localisation}`}
            </span>
            {selectedMapped.detailsDemande && (
              <div className="mt-3 space-y-1 text-xs text-white/75">
                {selectedMapped.detailsDemande.profil && (
                  <p>Profil demandé : {selectedMapped.detailsDemande.profil}</p>
                )}
                {selectedMapped.detailsDemande.plan_nom && (
                  <p>Formule souhaitée : {selectedMapped.detailsDemande.plan_nom}</p>
                )}
                {selectedMapped.detailsDemande.nombre_sites && (
                  <p>Sites estimés : {selectedMapped.detailsDemande.nombre_sites}</p>
                )}
                {Array.isArray(selectedMapped.detailsDemande.objectifs) &&
                  selectedMapped.detailsDemande.objectifs.length > 0 && (
                    <p>Priorités : {selectedMapped.detailsDemande.objectifs.join(", ")}</p>
                  )}
                {Array.isArray(selectedMapped.detailsDemande.sources) &&
                  selectedMapped.detailsDemande.sources.length > 0 && (
                    <p>Données disponibles : {selectedMapped.detailsDemande.sources.join(", ")}</p>
                  )}
              </div>
            )}
          </div>
          <div className="adm-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => updateOrgStatus(
                selectedMapped.id,
                "Actif",
                selectedMapped.rawStatut === "EN_ATTENTE",
              )}
            >
              <Check size={16} />
              {selectedMapped.rawStatut === "EN_ATTENTE" ? "Approuver et envoyer l’invitation" : "Approuver"}
            </button>
            {selectedMapped.rawStatut !== "EN_ATTENTE" && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => updateOrgStatus(selectedMapped.id, "Suspendu")}
              >
                Suspendre
              </button>
            )}
          </div>
        </GlassCard>
      )}
    </>
  );
}