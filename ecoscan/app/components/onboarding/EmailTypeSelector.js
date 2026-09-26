"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * EmailTypeSelector — Sélecteur ultra-moderne 2026 en radio-cartes.
 * Palette SENELEC x EcoScan (Royal, Cyan Data, Navy).
 * Accessibilité : role="radiogroup", role="radio", aria-checked, keyboard navigable.
 */

const EMAIL_TYPES = [
  {
    id: "professionnel",
    label: "Email professionnel",
    hint: "Pour votre activité.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M16 2H8L2 6h20l-6-4z" />
        <path d="M2 6l10 7 10-7" />
      </svg>
    ),
  },
  {
    id: "personnel",
    label: "Email personnel",
    hint: "Pour commencer simplement.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "entreprise",
    label: "Email entreprise",
    hint: "Pour gérer votre organisation.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
  },
]

export function EmailTypeSelector({ value, onChange, theme = "dark" }) {
  const isDark = theme === "dark"

  return (
    <div
      role="radiogroup"
      aria-label="Type d'email pour votre compte EcoScan"
      className="grid grid-cols-1 gap-3.5 sm:grid-cols-3"
    >
      {EMAIL_TYPES.map((type) => {
        const selected = value === type.id
        return (
          <button
            key={type.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type.id)}
            className={cn(
              "group relative flex flex-col items-start rounded-2xl p-5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-data",
              isDark
                ? selected
                  ? "border-2 border-cyan-data bg-navy-mid/90 shadow-royal scale-[1.02] ring-1 ring-cyan-data/40"
                  : "border border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 hover:-translate-y-0.5"
                : selected
                  ? "border-2 border-royal bg-sky-ui/80 shadow-royal scale-[1.02] ring-2 ring-royal/20"
                  : "border border-sky-border bg-white hover:border-royal/50 hover:bg-sky-ui/20 hover:-translate-y-0.5"
            )}
          >
            {/* Indicateur de sélection coin haut droit */}
            <div className="absolute right-4 top-4 flex items-center justify-center">
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200",
                  selected
                    ? "border-cyan-data bg-cyan-data text-navy"
                    : isDark ? "border-white/20 bg-transparent" : "border-slate/30 bg-transparent"
                )}
              >
                {selected && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path d="M2.5 5L4.5 7L7.5 3" stroke="#0A1628" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </span>
            </div>

            {/* Icône du type */}
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                selected
                  ? "bg-royal text-white shadow-sm"
                  : isDark ? "bg-white/10 text-white/80 group-hover:bg-white/15" : "bg-sky-ui text-royal group-hover:bg-sky-mid/50"
              )}
            >
              {type.icon}
            </span>

            {/* Titre */}
            <span
              className={cn(
                "mt-4 block font-display text-sm font-bold tracking-tight transition-colors",
                isDark
                  ? selected ? "text-white" : "text-white/90"
                  : selected ? "text-navy" : "text-navy/90"
              )}
            >
              {type.label}
            </span>

            {/* Description contextuelle */}
            <span
              className={cn(
                "mt-1 block text-xs leading-relaxed transition-colors",
                isDark ? "text-white/60" : "text-slate"
              )}
            >
              {type.hint}
            </span>
          </button>
        )
      })}
    </div>
  )
}
