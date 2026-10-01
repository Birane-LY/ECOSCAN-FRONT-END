"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import LogoLockup from "@/app/components/brand/LogoLockup"

/**
 * ConfirmationScreen — Confirmation de création du compte avant activation de l'essai.
 * Palette SENELEC x EcoScan (Navy, Royal, Cyan Data, Sky UI).
 */
export function ConfirmationScreen({ nom, email, planName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-lg text-center"
    >
      {/* Symbol */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-royal/10 text-royal">
            <LogoLockup variant="symbol" theme="dark" />
          </div>
          <span
            className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-data shadow"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
              <path d="M2.5 5L4.5 7L7.5 3" stroke="#0A1628" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* Heading */}
      <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold text-navy">
        Vérifiez votre adresse e-mail.
      </h2>

      {/* Statut d'attente (calme, transparent) */}
      <div className="mt-5 rounded-2xl border border-sky-border bg-sky-ui/60 px-6 py-4 shadow-sm">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
          Prochaine étape
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber animate-pulse" aria-hidden="true" />
          <span className="font-display text-sm font-bold text-navy">
            Activation de votre compte
          </span>
        </div>
      </div>

      {/* Explication */}
      <p className="mt-6 text-sm leading-relaxed text-slate text-pretty">
        Votre formule {planName ? <strong className="font-semibold text-navy">{planName}</strong> : "choisie"} est réservée à votre espace.{" "}
        {email ? (
          <>
            Ouvrez le lien d’activation envoyé à{" "}
            <span className="font-semibold text-navy">{email}</span>.
          </>
        ) : (
          "Vous recevrez les prochaines étapes à l'adresse indiquée."
        )}
      </p>

      {/* Chronologie des prochaines étapes */}
      <div className="mt-8 rounded-2xl border border-sky-border bg-white p-6 text-left shadow-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-royal">
          Prochaines étapes
        </p>
        <ol className="mt-4 space-y-3.5">
          {[
              "Activez votre compte depuis le lien reçu par e-mail",
              "Votre essai gratuit de 14 jours démarre sur la formule choisie",
              "Définissez votre mot de passe et connectez-vous à EcoScan",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-xs md:text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-ui border border-sky-border font-mono text-[11px] font-bold text-royal">
                {i + 1}
              </span>
              <span className="text-navy/90">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-sky-border bg-white px-6 py-3 text-xs font-semibold text-navy transition-all hover:bg-sky-ui hover:border-royal/50 shadow-sm"
        >
          ← Revenir à l'accueil
        </Link>
        <Link
          href="/solution"
          className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-xs font-semibold text-white transition-all hover:bg-royal-deep shadow-royal"
        >
          Découvrir la solution
        </Link>
      </div>
    </motion.div>
  )
}
