"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import Header from "@/app/components/navigation/Header"
import { Footer } from "@/app/components/footer/Footer"
import { CtaFinalSection } from "@/app/components/cta/CtaFinalSection"

const PRODUCT_SCREENS = [
  {
    src: "/images/product/dashboard-analyses.png",
    title: "Analyses",
    description: "Les anomalies et leurs explications, réunies au même endroit.",
    alt: "Écran Analyses EcoScan : anomalies détectées et recommandations.",
    width: 768,
    height: 1597,
  },
  {
    src: "/images/product/dashboard-objectifs.png",
    title: "Objectifs",
    description: "Suivez une trajectoire concrète, du premier engagement au résultat.",
    alt: "Écran Objectifs EcoScan : progression des engagements énergétiques.",
    width: 1103,
    height: 768,
  },
  {
    src: "/images/product/dashboard-memoire.png",
    title: "Mémoire",
    description: "Retrouvez les décisions et les enseignements de votre organisation.",
    alt: "Écran Mémoire EcoScan : décisions et historique de l'organisation.",
    width: 968,
    height: 768,
  },
  {
    src: "/images/product/dashboard-outils.png",
    title: "Outils",
    description: "Explorez les outils opérationnels pour éclairer les prochains choix.",
    alt: "Écran Outils EcoScan : simulateur financier et outils de pilotage.",
    width: 768,
    height: 897,
  },
]

function ProductFrame({ src, alt, width, height, className = "" }) {
  return (
    <div className={`solution-screen ${className}`}>
      <div className="solution-screen__toolbar" aria-hidden="true">
        <span />
        <span />
        <span />
        <span className="solution-screen__toolbar-label">ecoscan · espace de pilotage</span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="solution-screen__image"
        sizes="(max-width: 760px) 92vw, (max-width: 1200px) 82vw, 780px"
      />
    </div>
  )
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function SolutionPage() {
  return (
    <main className="solution-page">
      <Header revealAfter={-1} />

      <section className="solution-hero">
        <div className="solution-hero__copy">
          <p className="solution-eyebrow">
            <span />
            Votre espace EcoScan
          </p>
          <h1>Les chiffres prennent leur place. Les décisions aussi.</h1>
          <p className="solution-hero__description">
            Un espace clair pour comprendre vos consommations, repérer les
            écarts et suivre les décisions qui comptent.
          </p>
          <Link href="/abonnement" className="solution-primary-link">
            Choisir ma formule <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <Reveal className="solution-hero__preview">
          <ProductFrame
            src="/images/product/dashboard-overview.png"
            alt="Vue d'ensemble du tableau de bord EcoScan avec ses indicateurs de consommation."
            width={768}
            height={1273}
          />
          <div className="solution-hero__caption">
            <span className="solution-live-dot" />
            Une vue d&apos;ensemble, construite à partir de vos données
          </div>
        </Reveal>

        <a className="solution-scroll-cue" href="#espace">
          <span>Découvrir l&apos;espace</span>
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="solution-workspace" id="espace">
        <div className="solution-section-heading">
          <Reveal>
            <p className="solution-eyebrow">
              <span />
              Un outil fait pour agir
            </p>
            <h2>Votre énergie, vue depuis votre activité.</h2>
            <p>
              Voici les écrans de votre espace de pilotage — pas des
              illustrations, mais l&apos;interface EcoScan elle-même.
            </p>
          </Reveal>
        </div>

        <div className="solution-feature-list">
          <Reveal className="solution-feature">
            <div className="solution-feature__copy">
              <span className="solution-feature__number">01</span>
              <h3>Repérez ce qui mérite votre attention.</h3>
              <p>
                Les analyses rassemblent les écarts détectés, les éléments de
                contexte et les prochaines actions possibles.
              </p>
              <span className="solution-feature__tag">Analyses & anomalies</span>
            </div>
            <ProductFrame
              src={PRODUCT_SCREENS[0].src}
              alt={PRODUCT_SCREENS[0].alt}
              width={PRODUCT_SCREENS[0].width}
              height={PRODUCT_SCREENS[0].height}
              className="solution-screen--wide"
            />
          </Reveal>

          <Reveal className="solution-feature solution-feature--reverse">
            <div className="solution-feature__copy">
              <span className="solution-feature__number">02</span>
              <h3>Gardez le cap sur vos objectifs.</h3>
              <p>
                Visualisez vos engagements et l&apos;avancement de votre
                trajectoire sans perdre de vue les résultats mesurés.
              </p>
              <span className="solution-feature__tag">Objectifs & progression</span>
            </div>
            <ProductFrame
              src={PRODUCT_SCREENS[1].src}
              alt={PRODUCT_SCREENS[1].alt}
              width={PRODUCT_SCREENS[1].width}
              height={PRODUCT_SCREENS[1].height}
              className="solution-screen--wide"
            />
          </Reveal>
        </div>
      </section>

      <section className="solution-tools">
        <Reveal className="solution-tools__heading">
          <p className="solution-eyebrow">
            <span />
            Chaque écran a son rôle
          </p>
          <h2>Une même lecture, du diagnostic au quotidien.</h2>
        </Reveal>

        <div className="solution-screen-gallery">
          {PRODUCT_SCREENS.slice(2).map((screen, index) => (
            <Reveal className="solution-gallery-item" key={screen.title} delay={index * 0.08}>
              <ProductFrame
                src={screen.src}
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                className="solution-screen--gallery"
              />
              <div className="solution-gallery-item__copy">
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaFinalSection />
      <Footer />
    </main>
  )
}
