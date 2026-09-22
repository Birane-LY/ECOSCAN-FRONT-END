"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GoalHero } from "@/modules/goals/components/GoalHero";
import { GoalMetricCard } from "@/modules/goals/components/GoalMetricCard";
import { MilestoneBanner } from "@/modules/goals/components/MilestoneBanner";
import { useGoalsData } from "@/modules/goals/hooks/useGoalsData";
import { CreateGoalModal } from "@/modules/goals/components/CreateGoalModal";

const pct = (o) => (o.valeur_cible ? (o.progression_actuelle / o.valeur_cible) * 100 : 0);

export function GoalsView() {
  const { objectifs, loading, error, updateObjectif, reload } = useGoalsData();
  const [createOpen, setCreateOpen] = useState(false);

  const actifs = objectifs.filter((o) => o.statut === "ACTIF");
  // L'objectif mis en avant est celui dont l'échéance est la plus proche ; sans date, il passe après
  const hero = [...actifs].sort(
    (a, b) => (a.date_fin ? new Date(a.date_fin) : Infinity) - (b.date_fin ? new Date(b.date_fin) : Infinity),
  )[0];
  const globalProgress = actifs.length
    ? Math.round(actifs.reduce((sum, o) => sum + pct(o), 0) / actifs.length)
    : 0;

  return (
    <div className="gl">
      <PageHeader
        title="Objectifs"
        subtitle="Pilotez vos engagements avec une trajectoire qui respire."
        action={
          <button className="primary-button" onClick={() => setCreateOpen(true)}>
            <Plus size={17} />
            Nouvel objectif
          </button>
        }
      />

      {loading && <p className="drawer-lead">Chargement…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}
      {!loading && !error && objectifs.length === 0 && (
        <p className="drawer-lead">Aucun objectif défini pour le moment. Créez le premier.</p>
      )}

      <GoalHero objectif={hero} onUpdateTarget={updateObjectif} />

      <div className="gl-grid">
        {objectifs.map((o) => (
          <GoalMetricCard key={o.id} objectif={o} onChanged={reload} />
        ))}
      </div>

      <MilestoneBanner goal={globalProgress} />

      {createOpen && <CreateGoalModal onClose={() => setCreateOpen(false)} onCreated={reload} />}
    </div>
  );
}
