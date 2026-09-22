"use client";

import React, { useMemo, useState } from "react";
import { BrainCircuit, List, Maximize2, Minus, Network, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useMemoiresStrategiques } from "@/modules/memory/hooks/useMemoiresStrategiques";
import { useHypotheses } from "@/modules/memory/hooks/useHypotheses";
import { useOrganisation } from "@/modules/business-tools/hooks/useOrganisation";
import { MemoryCard } from "@/modules/memory/components/MemoryCard";
import { HypothesisReviewBanner } from "@/modules/memory/components/HypothesisReviewBanner";
import { MemoryGraph } from "./MemoryGraph";
import { MemoryDetail } from "./MemoryDetail";
import { MemoryTimeline } from "./MemoryTimeline";
import { GROUPS, buildGraph, monthKey } from "./memoryLayout";

const FILTRES = ["Toutes", "Confirmées", "À vérifier"];
const fmt = (n) => Math.round(n).toLocaleString("fr-FR");

export function MemoryView({ onAsk }) {
  const { memoires, loading, error, reload } = useMemoiresStrategiques();
  const { hypotheses, confirmer, rejeter } = useHypotheses();
  const { organisation } = useOrganisation();

  const [mode, setMode] = useState("graph"); // 'graph' | 'list'
  const [filtre, setFiltre] = useState("Toutes");
  const [hidden, setHidden] = useState(() => new Set());
  const [month, setMonth] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState(false);

  const visibleMemoires = useMemo(
    () => (month ? memoires.filter((m) => monthKey(m.date_creation) === month) : memoires),
    [memoires, month],
  );

  const { nodes, edges } = useMemo(
    () => buildGraph({ memoires: visibleMemoires, hypotheses, hidden }),
    [visibleMemoires, hypotheses, hidden],
  );

  const selected = nodes.find((n) => n.id === selectedId) || null;

  const stats = useMemo(() => {
    const confirmed = memoires.filter((m) => m.statut === "CONFIRMEE").length;
    const mesure = memoires.reduce((s, m) => s + (Number(m.impact_mesure_fcfa) || 0), 0);
    const taux = memoires.map((m) => Number(m.taux_realisation)).filter((v) => Number.isFinite(v));
    return {
      total: memoires.length,
      confirmed,
      pending: hypotheses.length,
      mesure,
      tauxMoyen: taux.length ? Math.round(taux.reduce((a, b) => a + b, 0) / taux.length) : null,
    };
  }, [memoires, hypotheses]);

  const counts = useMemo(() => {
    const c = { CONFIRMEE: 0, PARTIELLE: 0, A_VERIFIER: 0, HYPOTHESE: hypotheses.length };
    memoires.forEach((m) => {
      if (m.statut === "CONFIRMEE") c.CONFIRMEE += 1;
      else if (m.statut === "PARTIELLEMENT_CONFIRMEE") c.PARTIELLE += 1;
      else c.A_VERIFIER += 1;
    });
    return c;
  }, [memoires, hypotheses]);

  const toggleGroup = (id) =>
    setHidden((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleConfirm = async (id, confiance) => {
    setBusy(true);
    try {
      await confirmer(id, confiance);
      setSelectedId(null);
      reload();
    } finally {
      setBusy(false);
    }
  };
  const handleReject = async (id) => {
    setBusy(true);
    try {
      await rejeter(id);
      setSelectedId(null);
    } finally {
      setBusy(false);
    }
  };

  const listeVisible = memoires.filter((m) => {
    if (filtre === "Toutes") return true;
    if (filtre === "Confirmées") return m.statut === "CONFIRMEE";
    return m.statut !== "CONFIRMEE";
  });

  const empty = !loading && !error && memoires.length === 0 && hypotheses.length === 0;

  return (
    <>
      <PageHeader
        title="Ce qu'EcoScan a appris de votre organisation."
        subtitle="Chaque diagnostic confirmé enrichit durablement la compréhension de votre activité."
        action={
          <div className="segmented" role="group" aria-label="Mode d’affichage">
            <button type="button" className={mode === "graph" ? "selected" : ""} onClick={() => setMode("graph")}>
              <Network size={15} /> Constellation
            </button>
            <button type="button" className={mode === "list" ? "selected" : ""} onClick={() => setMode("list")}>
              <List size={15} /> Liste
            </button>
          </div>
        }
      />

      {loading && <p className="drawer-lead">Chargement de la mémoire…</p>}
      {error && <p className="drawer-lead">Erreur : {error}</p>}

      {mode === "graph" && !loading && !error && (
        <div className="mem">
          <div className="mem-stage">
            <section className="mem-canvas glass" aria-label="Constellation de la mémoire">
              <div className="mem-legend glass">
                {GROUPS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    data-silent
                    aria-pressed={!hidden.has(g.id)}
                    className={hidden.has(g.id) ? "off" : ""}
                    onClick={() => toggleGroup(g.id)}
                  >
                    <i className={`swatch ${g.tone}`} />
                    <span>{g.label}</span>
                    <b>{counts[g.id]}</b>
                  </button>
                ))}
              </div>

              <div className="mem-zoom glass" data-silent>
                <button type="button" aria-label="Zoomer" onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))}>
                  <Plus size={16} />
                </button>
                <button type="button" aria-label="Dézoomer" onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}>
                  <Minus size={16} />
                </button>
                <button type="button" aria-label="Recentrer" onClick={() => setZoom(1)}>
                  <Maximize2 size={15} />
                </button>
              </div>

              <MemoryGraph
                nodes={nodes}
                edges={edges}
                orgName={organisation?.nom || "Votre organisation"}
                total={stats.total}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
                zoom={zoom}
              />

              {empty && (
                <div className="mem-empty">
                  <BrainCircuit size={18} />
                  <span>
                    Aucun diagnostic mémorisé. Une anomalie confirmée avec une action mesurée devient automatiquement
                    une mémoire durable.
                  </span>
                </div>
              )}

              {memoires.length > 0 && <MemoryTimeline memoires={memoires} value={month} onChange={setMonth} />}
            </section>

            <aside className="mem-panel glass" aria-live="polite">
              <MemoryDetail
                node={selected}
                stats={stats}
                busy={busy}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onAsk={onAsk}
              />
            </aside>
          </div>

          <div className="mem-kpis glass">
            <div>
              <span>Mémoires</span>
              <strong>{stats.total}</strong>
            </div>
            <div>
              <span>Confirmées</span>
              <strong>{stats.confirmed}</strong>
            </div>
            <div>
              <span>Impact mesuré cumulé</span>
              <strong>{fmt(stats.mesure)} <small>FCFA</small></strong>
            </div>
            <div>
              <span>Réalisation moyenne</span>
              <strong>{stats.tauxMoyen != null ? `${stats.tauxMoyen} %` : "—"}</strong>
            </div>
          </div>
        </div>
      )}

      {mode === "list" && !loading && !error && (
        <>
          <HypothesisReviewBanner onConfirmed={reload} />

          <div className="view-toolbar">
            <div className="segmented">
              {FILTRES.map((f) => (
                <button key={f} className={filtre === f ? "selected" : ""} onClick={() => setFiltre(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {listeVisible.length === 0 && (
            <div className="insight-banner" style={{ marginTop: 20 }}>
              <BrainCircuit size={19} />
              <div>
                <strong>Aucun diagnostic mémorisé pour le moment.</strong>
                <span>Une anomalie confirmée avec une action mesurée devient automatiquement une mémoire durable.</span>
              </div>
            </div>
          )}

          <section className="analysis-grid" style={{ marginTop: 20 }}>
            {listeVisible.map((m) => (
              <MemoryCard key={m.id} memoire={m} />
            ))}
          </section>
        </>
      )}
    </>
  );
}
