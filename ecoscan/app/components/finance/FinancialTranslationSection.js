"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

const STEPS = [
  {
    number: "01",
    title: "Intégrer les informations",
    subtitle: "Partir de ce que l’organisation possède déjà.",
    description:
      "Factures, relevés et informations d’activité constituent les premiers éléments à organiser.",
    image: "/images/product/dashboard-overview.png",
    alt: "Vue d'ensemble EcoScan et indicateurs de consommation.",
    width: 768,
    height: 1273,
  },
  {
    number: "02",
    title: "Analyser les évolutions",
    subtitle: "Mettre les informations en contexte.",
    description:
      "Les analyses aident à repérer des variations et des points qui peuvent mériter un examen.",
    image: "/images/product/dashboard-analyses.png",
    alt: "Analyses EcoScan avec les anomalies et leur contexte.",
    width: 768,
    height: 1597,
  },
  {
    number: "03",
    title: "Visualiser les données",
    subtitle: "Rendre la lecture plus accessible.",
    description:
      "Les vues de synthèse donnent des repères pour lire les données énergétiques et leur évolution.",
    image: "/images/product/dashboard-outils.png",
    alt: "Écran des outils EcoScan pour visualiser les informations énergétiques.",
    width: 768,
    height: 897,
  },
  {
    number: "04",
    title: "Suivre les actions",
    subtitle: "Garder le fil des démarches engagées.",
    description:
      "Les objectifs et leur progression aident à suivre les actions engagées au fil du temps.",
    image: "/images/product/dashboard-objectifs.png",
    alt: "Objectifs EcoScan et progression des engagements.",
    width: 1103,
    height: 768,
  },
  {
    number: "05",
    title: "Décision documentée",
    subtitle: "Garder une mémoire utile.",
    description:
      "Retrouvez les diagnostics, les hypothèses et les décisions pour inscrire chaque progrès dans la durée.",
    image: "/images/product/dashboard-memoire.png",
    alt: "Mémoire EcoScan et historique des décisions de l'organisation.",
    width: 968,
    height: 768,
  },
]

export function FinancialTranslationSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="finance" className="financial-story">
      <div className="financial-story__intro">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-cyan-data">
          Le parcours EcoScan
        </p>
        <h2>
          Des données structurées aux actions suivies.
        </h2>
        <p>
          Découvrez les écrans du prototype EcoScan : intégrer les informations,
          les analyser, faire émerger des points d’attention et suivre les actions.
        </p>
      </div>

      <div className="financial-story__steps">
        {STEPS.map((step) => (
          <motion.article
            key={step.number}
            className="financial-story__step"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="financial-story__copy">
              <span className="financial-story__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p className="financial-story__subtitle">{step.subtitle}</p>
              <p className="financial-story__description">{step.description}</p>
            </div>
            <figure className="financial-story__screen">
              <div className="financial-story__toolbar" aria-hidden="true">
                <span />
                <span />
                <span />
                <span>ecoscan · espace de pilotage</span>
              </div>
              <Image
                src={step.image}
                alt={step.alt}
                width={step.width}
                height={step.height}
                sizes="(max-width: 768px) 92vw, 54vw"
              />
            </figure>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
