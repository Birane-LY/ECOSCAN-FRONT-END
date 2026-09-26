"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import Header from "@/app/components/navigation/Header"
import { Footer } from "@/app/components/footer/Footer"
import { CtaFinalSection } from "@/app/components/cta/CtaFinalSection"

/**
 * Page A propos — contexte, approche et évolution du prototype.
 * Compositions asymetriques. Photos editoriales. Typographie confiante.
 */

function FadeUp({ children, delay = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function SectionNumber({ n, light }) {
  return (
    <span className={`font-mono text-xs font-bold uppercase tracking-[0.3em] ${light ? "text-cyan-data" : "text-cyan-data"}`}>
      0{n}
    </span>
  )
}

export default function AboutPage() {
  return (
    <>
      <Header revealAfter={0} />

      {/* ── HERO ── */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden py-28 text-white">
        <Image
          src="/images/hero/about-hero.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#081b26]/95 via-[#081b26]/70 to-[#081b26]/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-cyan-data">
              À propos d’EcoScan
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white text-balance md:text-6xl lg:text-7xl">
              L’énergie ne devrait pas être une dépense que l’on constate simplement.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
              Elle devrait être une dépense que l’on comprend. EcoScan aide les organisations à lire leurs évolutions énergétiques et à transformer cette compréhension en décisions utiles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 01 PROBLEME ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
            {/* Aperçu de l'espace EcoScan */}
            <FadeUp>
              <div className="about-interface-preview">
                <Image
                  src="/images/product/dashboard-analyses.png"
                  alt="Écran Analyses EcoScan présentant les anomalies détectées et leur contexte."
                  width={768}
                  height={1597}
                  className="about-interface-preview__image"
                  sizes="(max-width: 1024px) 92vw, 45vw"
                />
              </div>
            </FadeUp>
            {/* Texte */}
            <FadeUp delay={0.1}>
              <SectionNumber n={1} />
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy text-balance md:text-4xl">
                Pourquoi EcoScan existe
              </h2>
              <p className="mt-5 leading-relaxed text-slate">
                Les organisations disposent souvent de factures, de relevés et d’informations sur leur activité, sans toujours pouvoir les relier à leurs décisions. Les données existent, mais leur volume ne suffit pas à rendre la situation plus claire.
              </p>
              <p className="mt-4 leading-relaxed text-slate">
                EcoScan part de ces informations pour les structurer, les mettre en contexte et faire émerger des points d’attention utiles au pilotage.
              </p>
              <div className="mt-7 rounded-xl border-l-4 border-royal bg-sky-ui px-5 py-4">
                <p className="font-display text-sm font-semibold text-navy">
                  Mieux comprendre ce que l’on consomme, c’est pouvoir décider avec davantage de clarté.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 02 PRINCIPES ── */}
      <section className="bg-sky-ui py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeUp>
            <SectionNumber n={2} />
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy text-balance md:text-5xl">
              Observer. Comprendre. Décider. Agir. Suivre.
            </h2>
            <p className="mt-4 max-w-2xl text-slate">
              Une démarche qui s’appuie sur les informations déjà disponibles, sans ajouter de complexité là où elles peuvent déjà éclairer l’action.
            </p>
          </FadeUp>
          <ol className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["01", "Observer", "Rassembler les informations énergétiques utiles."],
              ["02", "Comprendre", "Les mettre en perspective et repérer ce qui évolue."],
              ["03", "Décider", "Faire émerger des points d’attention compréhensibles."],
              ["04", "Agir", "Relier les constats aux actions de l’organisation."],
              ["05", "Suivre", "Observer les actions engagées et leurs résultats."],
            ].map(([n, title, body], i) => (
              <motion.li
                key={n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="flex list-none flex-col rounded-2xl bg-white p-6 shadow-navy"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-data">{n}</p>
                <h3 className="mt-3 font-display text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 03 PHILOSOPHIE ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeUp>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-orange-cta">Notre vision du produit</p>
              <blockquote className="mt-6 font-display text-3xl font-bold leading-snug text-navy text-balance md:text-4xl">
                &ldquo;Une technologie utile n’accumule pas les fonctionnalités : elle aide à mieux comprendre une situation et à prendre une meilleure décision.&rdquo;
              </blockquote>
              <div className="mt-8 h-1 w-16 rounded-full bg-orange-cta" aria-hidden="true" />
            </FadeUp>
            <FadeUp delay={0.12}>
              <h3 className="font-display text-xl font-bold text-navy">Ce qu’EcoScan défend.</h3>
              <ul className="mt-6 space-y-5">
                {[
                  "Rigueur sans jargon",
                  "Des analyses compréhensibles et transparentes",
                  "Le respect de la réalité opérationnelle",
                  "Des décisions éclairées, sans promesse de résultat",
                  "La reconnaissance des limites du prototype",
                ].map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-royal" aria-hidden="true">
                      <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="font-medium text-navy">{v}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 04 PORTEUR DU PROJET ── */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <FadeUp>
            <div className="about-founder-photo">
              <Image
                src="/images/people/birane-ly.jpg"
                alt="Portrait de Birane LY, porteur du projet EcoScan."
                fill
                sizes="(max-width: 1024px) 90vw, 400px"
                className="about-founder-photo__image"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <SectionNumber n={4} />
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-data">
              Derrière EcoScan
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-navy text-balance md:text-4xl">
              Un projet porté par une question simple.
            </h2>
            <p className="mt-5 leading-relaxed text-slate">
              <strong className="text-navy">EcoScan est porté par Birane LY, étudiant en Informatique et Développement d’Applications à l’UNCHK et apprenant en Développement Web / Intelligence Artificielle à Simplon Sénégal.</strong>
            </p>
            <p className="mt-4 leading-relaxed text-slate">
              Le projet est né de l’envie d’explorer une question : comment utiliser la technologie pour répondre à un problème concret plutôt que simplement ajouter un outil de plus ?
            </p>
            <p className="mt-4 leading-relaxed text-slate">
              EcoScan est une première réponse à cette réflexion, à la croisée du développement web, de l’intelligence artificielle et des enjeux liés à une utilisation plus responsable des ressources.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 05 AMBITION ── */}
      <section className="relative isolate flex min-h-[680px] items-center justify-center overflow-hidden py-28 text-white">
        <Image
          src="/images/story/ecoscan-workspace.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#081b26]/95 via-[#081b26]/78 to-[#081b26]/55"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-data-grid-dark opacity-20" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <FadeUp>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.35em] text-cyan-data">Et maintenant</p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-white text-balance md:text-6xl">
              Faire évoluer l’analyse énergétique au plus près des usages.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/65 text-pretty">
              Le prototype EcoScan réunit gestion des données, visualisation, analyse et services d’intelligence artificielle dans une même expérience. Il constitue une première version destinée à être confrontée aux usages et enrichie progressivement.
            </p>
          </FadeUp>
        </div>
      </section>

      <CtaFinalSection />
      <Footer />
    </>
  )
}
