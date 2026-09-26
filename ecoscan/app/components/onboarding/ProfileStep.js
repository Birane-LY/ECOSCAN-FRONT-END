"use client"

import { cn } from "@/lib/utils"

export const PROFILES = [
  {
    id: "pme",
    label: "PME & Site unique",
    text: "Une organisation souhaitant mieux comprendre et suivre ses informations énergétiques.",
  },
  {
    id: "entreprise",
    label: "Entreprise multi-sites",
    text: "Plusieurs sites à consolider, comparer et gouverner dans le temps.",
  },
  {
    id: "cabinet",
    label: "Cabinet de conseil",
    text: "Des diagnostics d'audit énergétique à structurer pour vos clients.",
  },
  {
    id: "partenaire",
    label: "Partenaire / Institution",
    text: "Accompagnement de programmes sectoriels ou de bénéficiaires.",
  },
]

function ProfileGlyph({ id }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 }
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      {id === "pme" && (
        <>
          <circle cx="16" cy="16" r="5" {...common} />
          <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
        </>
      )}
      {id === "entreprise" && (
        <>
          <path d="M6 20 H14 M18 12 H26 M12 20 V12 H20" {...common} />
          <circle cx="6" cy="20" r="2" fill="currentColor" stroke="none" />
          <circle cx="26" cy="12" r="2" fill="currentColor" stroke="none" />
        </>
      )}
      {id === "cabinet" && (
        <>
          <rect x="8" y="7" width="16" height="18" rx="2" {...common} />
          <path d="M11 12 H21 M11 16 H21 M11 20 H17" {...common} />
        </>
      )}
      {id === "partenaire" && (
        <>
          <circle cx="11" cy="16" r="3.5" {...common} />
          <circle cx="21" cy="16" r="3.5" {...common} />
          <path d="M14.5 16 H17.5" {...common} />
        </>
      )}
    </svg>
  )
}

export function ProfileStep({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="sr-only">Votre profil organisationnel</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROFILES.map((p) => {
          const selected = value === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              aria-pressed={selected}
              className={cn(
                "group relative flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal",
                selected
                  ? "border-2 border-royal bg-sky-ui/90 shadow-royal ring-2 ring-royal/20 scale-[1.01]"
                  : "border-sky-border bg-white hover:-translate-y-0.5 hover:border-royal/50 hover:bg-sky-ui/20 shadow-sm"
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                  selected ? "bg-royal text-white shadow-sm" : "bg-sky-ui text-royal group-hover:bg-sky-mid/60"
                )}
              >
                <ProfileGlyph id={p.id} />
              </span>
              <span className="mt-4 font-display text-base font-bold text-navy">
                {p.label}
              </span>
              <span className="mt-1.5 text-xs leading-relaxed text-slate">
                {p.text}
              </span>
              {selected && (
                <span
                  className="absolute right-4 top-4 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-data text-navy text-[10px] font-bold"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="mt-3 font-mono text-xs text-rust font-medium" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
