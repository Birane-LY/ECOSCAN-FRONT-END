"use client"

import { CinematicCardDeck } from "@/components/ui/cinematic-card-deck"

/**
 * ProofSection — Le prototype en situation.
 * Mecanique CinematicCardDeck PRESERVEE.
 * Palette recoloree : royal, navy, navy-mid — identite institutionnelle.
 */

const cards = [
  {
    title: "Les informations",
    description: "Factures, relevés et données d’activité à structurer.",
    tag: "Intégration",
    cardColor: "#146c7a",
    accentColor: "#ee8738",
    imageUrl: "/images/product/dashboard-overview.png",
  },
  {
    title: "L’analyse",
    description: "Des évolutions et points d’attention à examiner dans leur contexte.",
    tag: "Compréhension",
    cardColor: "#081b26",
    accentColor: "#4ccfcb",
    imageUrl: "/images/product/dashboard-analyses.png",
  },
  {
    title: "Les actions",
    description: "Des pistes à discuter et des démarches à suivre au sein de l’organisation.",
    tag: "Pilotage",
    cardColor: "#10323e",
    accentColor: "#e8f1ef",
    imageUrl: "/images/product/dashboard-outils.png",
  },
  {
    title: "Une première version",
    description: "Un prototype à confronter aux usages et à enrichir progressivement.",
    tag: "Évolution",
    cardColor: "#16414c",
    accentColor: "#ee8738",
    imageUrl: "/images/product/dashboard-memoire.png",
  },
]

export function ProofSection() {
  return (
    <section id="preuve" className="relative border-t border-sky-border bg-sky-ui">
      <div className="mx-auto max-w-7xl px-4 pt-24">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-cyan-data">
            Le prototype
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy text-balance md:text-5xl">
            Une expérience pour rapprocher l’analyse de la décision.
          </h2>
          <p className="mt-4 max-w-xl text-slate">
            EcoScan réunit gestion des données, visualisation, analyse et suivi dans un même parcours.
          </p>
        </div>
      </div>
      <div className="pb-8">
        <CinematicCardDeck
          cards={cards}
          intensity="cinematic"
          sectionHeight={360}
          cardWidth={520}
          cardHeight={360}
        />
      </div>
    </section>
  )
}
