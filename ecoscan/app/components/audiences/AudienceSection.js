"use client"

import { ScrollSplitCard } from "@/components/ui/scroll-split-card"

/**
 * AudienceSection — Pour qui.
 * Mecanique ScrollSplitCard PRESERVEE.
 * Palette recoloree : royal, navy, sky-ui.
 */
export function AudienceSection() {
  return (
    <section id="pour-qui" className="relative border-t border-sky-border bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-20">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-cyan-data">
          Pour qui
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-navy text-balance md:text-5xl">
          Une même démarche, adaptée à votre organisation.
        </h2>
        <p className="mt-4 max-w-xl text-slate">
          Défilez pour découvrir les trois profils, puis poursuivez naturellement votre visite.
        </p>
      </div>
      <div className="relative mt-8 w-full">
        <ScrollSplitCard
          imageSrc="/images/story/audience-intro.png"
          imageAlt="PME, équipe d’analyse et professionnel de terrain réunis dans une même image."
          cards={[
            {
              title: "PME",
              imageSrc: "/images/story/pme-operations.png",
              imageAlt: "Responsable d’une PME sur son site de production.",
              description:
                "Organiser les informations disponibles pour éclairer les décisions du quotidien.",
              bgColor: "#E8F1EF",
              textColor: "#081B26",
            },
            {
              title: "Entreprises",
              imageSrc: "/images/story/energy-analysis.png",
              imageAlt: "Dirigeant consultant son tableau de bord énergétique.",
              description:
                "Mettre en perspective les données de plusieurs sites et suivre les actions dans le temps.",
              bgColor: "#146C7A",
              textColor: "#FFFFFF",
            },
            {
              title: "Cabinets de conseil",
              imageSrc: "/images/story/consulting-team.png",
              imageAlt: "Une équipe de conseil échange autour de l’analyse énergétique de ses clients.",
              description:
                "Structurer les diagnostics et conserver une trace des analyses et des décisions.",
              bgColor: "#081B26",
              textColor: "#FFFFFF",
            },
          ]}
        />
      </div>
    </section>
  )
}
