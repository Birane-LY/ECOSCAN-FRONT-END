"use client"

import { cn } from "@/lib/utils"

const SECTORS = [
  "Industrie manufacturière",
  "Commerce, distribution & retail",
  "Hôtellerie, tourisme & restauration",
  "Santé & cliniques",
  "Bureaux, tertiaire & sièges sociaux",
  "Agroalimentaire & transformation",
  "Logistique, froid & entreposage",
  "Autre secteur",
]

const SOURCES = [
  "Factures SENELEC (BT / MT)",
  "Relevés de compteurs périodiques",
  "Puissances souscrites & contrats",
  "Inventaire des équipements énergivores",
  "Horaires d'exploitation & pointes",
]

const MATURITY = [
  { id: "faible", label: "Initial", hint: "Factures papiers, peu de centralisation." },
  { id: "moyen", label: "Intermédiaire", hint: "Fichiers Excel, données partielles." },
  { id: "eleve", label: "Avancé", hint: "Données régulières, suivi actif en place." },
]

export function ContextStep({ data, onChange, errors = {} }) {
  const showSites = data.profile === "entreprise" || data.profile === "partenaire"

  const toggleSource = (source) => {
    const current = data.availableSources || []
    onChange({
      availableSources: current.includes(source)
        ? current.filter((s) => s !== source)
        : [...current, source],
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label
          htmlFor="organisation-localisation"
          className="block font-display text-base font-bold text-navy"
        >
          Où se trouve votre organisation ?
        </label>
        <p className="mt-1 text-xs text-slate">
          Indiquez la ville et le pays pour situer votre demande.
        </p>
        <input
          id="organisation-localisation"
          type="text"
          maxLength={255}
          value={data.localisation || ""}
          onChange={(event) => onChange({ localisation: event.target.value })}
          aria-invalid={Boolean(errors.localisation)}
          placeholder="Ex. Dakar, Sénégal"
          className="mt-3 w-full rounded-xl border border-sky-border bg-white px-4 py-3.5 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20"
        />
        {errors.localisation && (
          <p className="mt-2 font-mono text-xs font-medium text-rust" role="alert">
            {errors.localisation}
          </p>
        )}
      </div>

      {/* Sector */}
      <div>
        <label
          htmlFor="sector"
          className="block font-display text-base font-bold text-navy"
        >
          Dans quel secteur opère votre organisation ?
        </label>
        <p className="mt-1 text-xs text-slate">
          Ces éléments aident à situer les informations énergétiques disponibles dans votre organisation.
        </p>
        <select
          id="sector"
          value={data.sector || ""}
          onChange={(e) => onChange({ sector: e.target.value })}
          aria-invalid={Boolean(errors.sector)}
          className="mt-3 w-full rounded-xl border border-sky-border bg-white px-4 py-3.5 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20"
        >
          <option value="" disabled>
            Sélectionnez votre secteur d'activité
          </option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.sector && (
          <p className="mt-2 font-mono text-xs text-rust font-medium" role="alert">
            {errors.sector}
          </p>
        )}
      </div>

      {/* Sites (conditional) */}
      {showSites && (
        <div>
          <label
            htmlFor="sites"
            className="block font-display text-base font-bold text-navy"
          >
            Nombre d'établissements ou compteurs à superviser
          </label>
          <p className="mt-1 text-xs text-slate">
            Estimation du nombre de sites ou points de livraison distincts.
          </p>
          <input
            id="sites"
            type="number"
            min="1"
            inputMode="numeric"
            value={data.sites || ""}
            onChange={(e) => onChange({ sites: e.target.value })}
            aria-invalid={Boolean(errors.sites)}
            placeholder="ex. 3"
            className="mt-3 w-44 rounded-xl border border-sky-border bg-white px-4 py-3.5 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20"
          />
          {errors.sites && (
            <p className="mt-2 font-mono text-xs text-rust font-medium" role="alert">
              {errors.sites}
            </p>
          )}
        </div>
      )}

      {/* Available sources */}
      <div>
        <p className="font-display text-base font-bold text-navy">
          Éléments déjà disponibles pour votre diagnostic
        </p>
        <p className="mt-1 text-xs text-slate">
          Sélectionnez ce dont vous disposez actuellement (aucun prérequis bloquant).
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {SOURCES.map((source) => {
            const active = (data.availableSources || []).includes(source)
            return (
              <button
                key={source}
                type="button"
                onClick={() => toggleSource(source)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-royal",
                  active
                    ? "border-royal bg-royal text-white shadow-sm"
                    : "border-sky-border bg-white text-navy hover:border-royal/50 hover:bg-sky-ui/40"
                )}
              >
                {active ? "✓ " : "+ "}
                {source}
              </button>
            )
          })}
        </div>
      </div>

      {/* Data maturity */}
      <div>
        <p className="font-display text-base font-bold text-navy">
          Niveau actuel de suivi énergétique interne
        </p>
        <div
          role="radiogroup"
          aria-label="Niveau de structuration des données"
          className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {MATURITY.map((m) => {
            const selected = data.dataMaturity === m.id
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ dataMaturity: m.id })}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-royal",
                  selected
                    ? "border-2 border-royal bg-sky-ui/90 ring-1 ring-royal/30 shadow-sm"
                    : "border-sky-border bg-white hover:border-royal/40 hover:bg-sky-ui/20"
                )}
              >
                <span className="font-display text-sm font-bold text-navy">
                  {m.label}
                </span>
                <span className="mt-1 block text-xs text-slate leading-relaxed">
                  {m.hint}
                </span>
              </button>
            )
          })}
        </div>
        {errors.dataMaturity && (
          <p className="mt-2 font-mono text-xs text-rust font-medium" role="alert">
            {errors.dataMaturity}
          </p>
        )}
      </div>
    </div>
  )
}
