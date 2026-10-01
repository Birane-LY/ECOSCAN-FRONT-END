"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

/**
 * CTA final partagé par les pages publiques EcoScan.
 */
export function CtaFinalSection() {
  const reduce = useReducedMotion()
  return (
    <section
      id="commencer"
      className="relative isolate flex min-h-[680px] items-center justify-center overflow-hidden py-28 text-white"
    >
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
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <p className="font-mono text-xs font-medium uppercase tracking-[0.35em] text-cyan-data">
          Votre prochain pas
        </p>
        <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-balance text-white md:text-6xl">
          Commencez à rendre votre énergie lisible.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/80 text-pretty">
          Présentez votre organisation et les informations énergétiques dont vous disposez. EcoScan est un prototype conçu pour évoluer avec les usages.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/abonnement"
              className="inline-flex items-center gap-2 rounded-full bg-orange-cta px-8 py-4 text-sm font-bold text-white shadow-royal transition-all hover:-translate-y-0.5 hover:bg-orange-deep hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-cta"
            >
              Commencer votre parcours
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/solution"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-medium text-white/90 transition-colors hover:border-white/50 hover:bg-white/8"
            >
              Découvrir la solution
            </Link>
        </div>
      </motion.div>
    </section>
  )
}
