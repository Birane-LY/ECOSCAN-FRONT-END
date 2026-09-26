"use client"

import { StepFlow } from "@/components/ui/step-flow"

/**
 * MethodeSection — "Notre méthode", built on StepFlow.
 *
 * Responsibility
 *   Presents EcoScan's five-step method as a navigable folder: each step
 *   swaps the companion image and slides the highlight, reading as a
 *   diagnosis progression rather than a flat timeline.
 *
 * Props
 *   None.
 *
 * Behavior
 *   Feeds the `steps` data into StepFlow, which handles hover/click/focus
 *   selection, the sliding highlight, and image cross-fade.
 *
 * Dependencies
 *   StepFlow.
 *
 * Fallback
 *   StepFlow degrades transitions to instant under reduced motion.
 */

const steps = [
  {
    serial: "01",
    title: "Intégrer",
    description:
      "Rassembler les informations disponibles : factures, relevés et données d’activité.",
    image: "/images/method/step-01-integrer.png",
  },
  {
    serial: "02",
    title: "Structurer",
    description:
      "Organiser les données pour les rendre plus lisibles et faciliter leur mise en contexte.",
    image: "/images/method/step-02-structurer.png",
  },
  {
    serial: "03",
    title: "Analyser",
    description:
      "Examiner les évolutions et faire ressortir les points qui méritent attention.",
    image: "/images/method/step-03-analyser.png",
  },
  {
    serial: "04",
    title: "Agir",
    description:
      "Formuler des pistes de décision à partir des constats et du contexte de l’organisation.",
    image: "/images/method/step-04-agir.png",
  },
  {
    serial: "05",
    title: "Suivre",
    description:
      "Garder une trace des actions engagées et rapprocher les décisions des résultats observés.",
    image: "/images/method/step-05-suivre.png",
  },
]

export function MethodeSection() {
  return (
    <section
      id="methode"
      className="relative border-t border-border bg-stone/40 bg-grain py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-copper">
            Notre méthode
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal text-balance md:text-5xl">
            Des informations énergétiques au suivi des actions.
          </h2>
          <p className="mt-4 max-w-xl text-slate">
            Un parcours de l’intégration à l’analyse, puis au suivi des actions.
            Sélectionnez une étape pour découvrir les écrans du prototype.
          </p>
        </div>

        <div className="mt-14">
          <StepFlow steps={steps} highlightColor="#2D5A46" />
        </div>
      </div>
    </section>
  )
}
