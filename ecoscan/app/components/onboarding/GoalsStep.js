"use client"

import { cn } from "@/lib/utils"

export const GOALS = [
  { id: "couts", label: "Comprendre et maîtriser les coûts de facturation" },
  { id: "pertes", label: "Identifier les fuites et dépassements de pointe" },
  { id: "investissement", label: "Prioriser les investissements selon le gain net" },
  { id: "dossier", label: "Préparer un dossier d'audit ou de transition" },
  { id: "suivre", label: "Mettre en place un suivi continu dans le temps" },
  { id: "clients", label: "Structurer des diagnostics pour mes clients" },
]

export function GoalsStep({ value = [], onChange, error }) {
  const toggle = (id) => {
    onChange(
      value.includes(id) ? value.filter((g) => g !== id) : [...value, id]
    )
  }

  return (
    <fieldset>
      <legend className="sr-only">Vos objectifs stratégiques</legend>
      <p className="text-sm text-slate">
        Sélectionnez les priorités immédiates de votre démarche (sélection multiple).
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOALS.map((goal) => {
          const active = value.includes(goal.id)
          return (
            <button
              key={goal.id}
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => toggle(goal.id)}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal",
                active
                  ? "border-2 border-royal bg-sky-ui/90 shadow-sm ring-1 ring-royal/20"
                  : "border-sky-border bg-white hover:border-royal/40 hover:bg-sky-ui/20 shadow-sm"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  active ? "border-royal bg-royal text-white" : "border-slate/30 bg-white"
                )}
                aria-hidden="true"
              >
                {active && (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7.5 L6 10 L11 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="font-display text-sm font-semibold text-navy">
                {goal.label}
              </span>
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
